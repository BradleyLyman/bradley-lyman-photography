import {
  S3Client,
  ListObjectsV2Command,
  HeadObjectCommand,
  HeadObjectCommandOutput,
  GetObjectCommand,
  CopyObjectCommand,
} from "@aws-sdk/client-s3";
import { Readable } from "stream";

const client = new S3Client({ region: "us-west-2" });

async function list_objects(
  bucket: string,
  continuation: string | undefined
): Promise<{ keys: string[]; next_continuation: string | undefined }> {
  const list_objects = new ListObjectsV2Command({
    Bucket: bucket,
    MaxKeys: 1000,
    ContinuationToken: continuation,
  });
  let output = await client.send(list_objects);

  let keys: string[] = [];
  for (let object_listing of output.Contents || []) {
    if (object_listing.Key) {
      keys.push(object_listing.Key);
    }
  }

  return { keys, next_continuation: output.NextContinuationToken };
}

export async function list_all_objects(bucket: string): Promise<string[]> {
  console.log("list all objects");
  let { keys: all_keys, next_continuation: continuation } = await list_objects(
    bucket,
    undefined
  );

  while (continuation) {
    console.log("listing objects...");
    let { keys, next_continuation } = await list_objects(bucket, continuation);
    continuation = next_continuation;
    all_keys = all_keys.concat(keys);
  }

  return all_keys;
}

export async function download_object(
  bucket: string,
  key: string
): Promise<Buffer> {
  let output = await client.send(
    new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    })
  );

  return new Promise(
    (resolve: (value: Buffer) => void, reject: (reason: any) => void) => {
      let body: Readable = output.Body as Readable;
      let chunks: Uint8Array[] = [];
      body.on("error", reject);
      body.on("data", (chunk: Uint8Array) => {
        chunks.push(chunk);
      });
      body.on("end", () => {
        resolve(Buffer.concat(chunks));
      });
    }
  );
}

export async function get_object_metadata(
  bucket: string,
  key: string
): Promise<HeadObjectCommandOutput["Metadata"]> {
  return client
    .send(new HeadObjectCommand({ Bucket: bucket, Key: key }))
    .then((response) => response.Metadata);
}

export async function write_object_metadata(
  bucket: string,
  key: string,
  metadata: Record<string, string>,
  content_type: string
): Promise<void> {
  console.log(metadata);
  await client.send(
    new CopyObjectCommand({
      Bucket: bucket,
      Key: key,
      CopySource: `${bucket}/${key}`,
      Metadata: metadata,
      MetadataDirective: "REPLACE",
      ContentType: content_type,
    })
  );
}
