import { ImageFormat } from "gatsby-plugin-image";
import {
  download_object,
  get_object_metadata,
  write_object_metadata,
  list_all_objects,
} from "./s3_objects";
import sharp from "sharp";
import util from "util";
import exifr from "exif-reader";

const METADATA_KEY: string = "remoteimagenode_v1";
const debug = util.debuglog("remote_image_node");

/**
 * The RemoteImage interface describes the max-quality image in S3.
 **/
export interface RemoteImage {
  id: number;
  bucket: string;
  key: string;
  width: number;
  height: number;
  format: ImageFormat;

  // "ExposureTime" in exif data
  exposure_time?: number;

  // "FNumber" in exif data
  fnumber?: number;

  // "ISO" in exif data
  iso?: number;

  // "FocalLength" in exif data
  focal_length?: number;

  // "LensModel" in exif data
  lens_model?: string;
}

/**
 * Get all of the remote image nodes contained by a given bucket.
 *
 * @param bucket - the bucket to check for remote image nodes
 * @return an array of RemoteImage promises
 */
export async function get_all_remote_images(
  bucket: string
): Promise<Promise<RemoteImage>[]> {
  let objects = await list_all_objects(bucket);
  debug(`found ${objects.length} remote images`);

  const data: Promise<RemoteImage>[] = objects.map(
    async (key: string, index: number) => {
      let image: RemoteImage = await get_remote_image(bucket, key);
      image.id = index;
      return image;
    }
  );

  return data;
}

/**
 * Get the RemoteImage node for a given bucket and key.
 * The RemoteImage struct is calculated by downloading the image file and
 * parsing the exif section.
 * The results are automatically cached in the S3 Object Metadata so that
 * subsequent builds will not need to download the entire object.
 *
 * @param bucket - the bucket containing the image
 * @param key - the s3 object key for the image
 * @return all of the data required for building image pages and albums
 **/
export async function get_remote_image(
  bucket: string,
  key: string
): Promise<RemoteImage> {
  let result = await check_remote_metadata(bucket, key);
  if (result != null) {
    debug(`Found metadata for ${key}: ${JSON.stringify(result, null, 2)}`);
    return result;
  }

  debug(`Building metadata for ${key}`);
  let remote_image = await build_remote_image(bucket, key);
  await write_remote_metadata(bucket, key, remote_image);
  debug(`Wrote metadata for ${key}: ${JSON.stringify(result, null, 2)}`);
  return remote_image;
}

/**
 * Build a remote image node by downloading the image and parsing metadata and
 * exif data from the remote file.
 *
 * @param bucket - the s3 bucket containing the image file
 * @param key - the s3 object key for the image file
 * @return An instance of the image node data. ID is always 0.
 **/
async function build_remote_image(
  bucket: string,
  key: string
): Promise<RemoteImage> {
  let buffer = await download_object(bucket, key);
  let metadata = await sharp(buffer).metadata();
  let exif_data = exifr(metadata.exif)["exif"];
  const result: RemoteImage = {
    id: 0,
    bucket,
    key,
    width: metadata.width,
    height: metadata.height,
    format: metadata.format == "jpeg" ? "jpg" : "auto",

    lens_model: exif_data["LensModel"],
    focal_length: exif_data["FocalLength"],
    fnumber: exif_data["FNumber"],
    iso: exif_data["ISO"],
    exposure_time: exif_data["ExposureTime"],
  };
  return result;
}

/**
 * Check the s3 object's metadata for an instance of the RemoteImage node.
 *
 * @param bucket - the s3 bucket containing the image file
 * @param key - the s3 object key for the image file
 * @return null if the metada doesn't contain the required data. Otherwise, an
 *         instance of the image node data which was generated on a previous
 *         build.
 */
async function check_remote_metadata(
  bucket: string,
  key: string
): Promise<RemoteImage | null> {
  let metadata = await get_object_metadata(bucket, key);
  if (metadata[METADATA_KEY]) {
    return JSON.parse(metadata[METADATA_KEY]);
  } else {
    return null;
  }
}

/**
 * Write a RemoteImage node into the object's metadata for use by subsequent
 * builds.
 *
 * @param bucket - the s3 bucket containing the image file
 * @param key - the s3 object key for the image file
 */
async function write_remote_metadata(
  bucket: string,
  key: string,
  remote_image: RemoteImage
): Promise<void> {
  let metadata: Record<string, string> = {};
  metadata[METADATA_KEY] = JSON.stringify(remote_image);
  return write_object_metadata(bucket, key, metadata);
}
