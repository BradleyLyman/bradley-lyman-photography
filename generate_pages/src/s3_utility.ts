import {
  S3Client,
  ListObjectsV2Command,
  ListObjectsV2CommandOutput
} from "@aws-sdk/client-s3";

const client = new S3Client({region: "us-west-1"});

async function list_objects(
  bucket: string,
  continuation: string | undefined
): Promise<{keys: string[], next_continuation: string | undefined}> {
  const list_objects = new ListObjectsV2Command({
    Bucket: bucket,
    MaxKeys: 200,
    ContinuationToken: continuation,
  });
  let output = await client.send(list_objects);

  let keys: string[] = [];
  for (let object_listing of output.Contents || []) {
    if (object_listing.Key) {
      keys.push(object_listing.Key);
    }
  }

  return {keys, next_continuation: output.NextContinuationToken};
}

export async function list_all_objects(bucket: string): Promise<string[]> {
  let {keys: all_keys, next_continuation: continuation} =
    await list_objects(bucket, undefined);

  while (continuation) {
    let {keys, next_continuation} = await list_objects(bucket, continuation);
    continuation = next_continuation;
    all_keys = all_keys.concat(keys);
  }

  return all_keys;
}

export async function list_all_folders(bucket: string): Promise<Set<string>> {
  let all_objects = await list_all_objects(bucket);
  let folders = new Set<string>();
  for (let object of all_objects) {
    let folder_name_end = object.indexOf("/");
    if (folder_name_end < 0 ) {
      continue;
    }
    folders.add(object.slice(0, folder_name_end));
  }

  return folders;
}
