import {
  S3Client,
  ListObjectsV2Command,
  ListObjectsV2CommandInput,
  _Object,
} from "@aws-sdk/client-s3";
import memoize from "micro-memoize";

const listObjectsRaw = async (
  client: S3Client,
  bucket: string
): Promise<string[]> => {
  let results: string[] = [];
  let more_results = true;
  let params: ListObjectsV2CommandInput = {
    Bucket: bucket,
    MaxKeys: 200,
  };
  while (more_results) {
    const output = await client.send(new ListObjectsV2Command(params));
    more_results = output.IsTruncated || false;
    params.ContinuationToken = output.NextContinuationToken!;

    if (output.Contents) {
      output.Contents.forEach((object_in_bucket: _Object) => {
        if (object_in_bucket.Key) {
          results.push(object_in_bucket.Key);
        }
      });
    }
  }
  return results;
};

const listObjectPrefixesRaw = async (
  client: S3Client,
  bucket: string
): Promise<string[]> => {
  let results: string[] = [];
  let more_results = true;
  let params: ListObjectsV2CommandInput = {
    Bucket: bucket,
    MaxKeys: 200,
    Delimiter: "/",
  };
  while (more_results) {
    const output = await client.send(new ListObjectsV2Command(params));
    more_results = output.IsTruncated || false;
    params.ContinuationToken = output.NextContinuationToken!;

    if (output.CommonPrefixes) {
      output.CommonPrefixes.forEach((prefix) => {
        if (prefix.Prefix) {
          results.push(prefix.Prefix);
        }
      });
    }
  }
  return results;
};

export const listObjects: (
  client: S3Client,
  bucket: string
) => Promise<string[]> = memoize(listObjectsRaw);

export const listObjectPrefixes: (
  client: S3Client,
  bucket: string
) => Promise<string[]> = memoize(listObjectPrefixesRaw);
