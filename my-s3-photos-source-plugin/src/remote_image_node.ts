import { list_all_objects } from "./s3_objects";
import { invoke } from "./lambda_invoke";
import { RemoteImage } from "my-s3-photos-types";
import util from "util";

const debug = util.debuglog("remote_image_node");

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
      let image: RemoteImage = await invoke<RemoteImage>("get_remote_image", {
        bucket: bucket,
        key: key,
      });
      image.id = index;
      return image;
    }
  );

  return data;
}
