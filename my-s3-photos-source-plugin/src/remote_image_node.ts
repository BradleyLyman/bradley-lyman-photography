import { ImageFormat } from "gatsby-plugin-image";
import { list_all_objects } from "./s3_objects";
import util from "util";

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
