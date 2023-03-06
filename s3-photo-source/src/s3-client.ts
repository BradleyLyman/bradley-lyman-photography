import {
  S3Client,
  ListObjectsV2Command,
  ListObjectsV2CommandInput,
} from "@aws-sdk/client-s3";

const BUCKET_NAME = "elocaters-photos";

const client = new S3Client({
  region: "us-west-1",
});

/**
 * List all objects in my photo bucket.
 **/
export async function listAllObjects(): Promise<string[]> {
  console.debug("List all S3 Objects");

  let truncated = true;
  let object_keys: string[] = [];
  let params: ListObjectsV2CommandInput = {
    Bucket: BUCKET_NAME,
  };

  while (truncated) {
    let response = await client.send(new ListObjectsV2Command(params));

    console.debug(`found ${response.Contents!.length} objects`);
    for (let object of response.Contents!) {
      object_keys.push(object.Key!);
    }

    truncated = response.IsTruncated || false;
    if (truncated) {
      params.ContinuationToken = response.NextContinuationToken;
    }
  }

  console.debug(
    `finished listing ${object_keys.length} objects in ${BUCKET_NAME}`
  );

  return object_keys;
}
