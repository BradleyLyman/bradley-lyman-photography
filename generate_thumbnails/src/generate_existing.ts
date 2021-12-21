/**
 * Invoke the lambda function to generate thumbnails for all existing
 * pictures in the elocaters-photos bucket.
 **/

import {
  S3Client,
  ListObjectsV2Command,
  ListObjectsV2CommandOutput
} from "@aws-sdk/client-s3";
import {
  LambdaClient,
  InvokeCommand,
  InvokeCommandOutput
} from "@aws-sdk/client-lambda"; // ES Modules import
import { Buffer } from 'buffer';

const client = new S3Client({region: "us-west-1"});
const lambda = new LambdaClient({region: "us-west-1"});

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

async function list_all_objects(bucket: string): Promise<string[]> {
  let {keys: all_keys, next_continuation: continuation} =
    await list_objects(bucket, undefined);

  while (continuation) {
    let {keys, next_continuation} = await list_objects(bucket, continuation);
    continuation = next_continuation;
    all_keys = all_keys.concat(keys);
  }

  return all_keys;
}

function build_event_payload(object_key: string): Uint8Array {
  const payload = {
    Records: [
      { s3: { object: {
        key: object_key,
      }}}
    ]
  };
  let buffer = Buffer.from(JSON.stringify(payload));
  return buffer;
};

async function invoke_lambda(object_key: string): Promise<InvokeCommandOutput> {
  return await lambda.send(new InvokeCommand({
    FunctionName: "generate_thumbnails",
    InvocationType: "Event",
    Payload: build_event_payload(object_key),
  }));
}

async function find_missing_thumbnails(): Promise<string[]> {
  let [all_photos, all_thumbnails] = await Promise.all([
    list_all_objects("elocaters-photos"),
    list_all_objects("elocaters-photos-compressed")
  ]);
  return all_photos.filter(item => !all_thumbnails.includes(item));
}

async function generate_missing_thumbnails() {
  let missing_objects = await find_missing_thumbnails();
  for (let object_key of missing_objects) {
    if (object_key.endsWith("JPG")) {
      console.log("generate thumbnail for", object_key);
      await invoke_lambda(object_key);
    }
  }
}

//find_missing_thumbnails().then(console.log, console.error);

generate_missing_thumbnails().then(console.log, console.error);



