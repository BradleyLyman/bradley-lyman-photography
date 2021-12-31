import { ImageFormat } from "gatsby-plugin-image";

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

export interface OptimizeImageRequest {
  bucket: string;
  key: string;

  desired_bucket: number;
  desired_width: number;
  desired_height: number;
  desired_format: ImageFormat;
  desired_quality: number;
}

export function generated_url({
  key,
  desired_bucket,
  desired_width,
  desired_height,
  desired_format,
  desired_quality,
}: OptimizeImageRequest) {
  return `https://${desired_bucket}.s3.us-west-2.amazonaws.com/${key}_${desired_width}_${desired_height}_${desired_quality}.${desired_format}`;
}
