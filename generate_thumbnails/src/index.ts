import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import {S3Client, GetObjectCommand, PutObjectCommand} from '@aws-sdk/client-s3';
import Sharp from 'sharp';
import {S3Event} from 'aws-lambda';

const appname = "elocaters_photos_thumbnails";
const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), appname));
const bucket= "elocaters-photos";
const thumbnail_bucket = "elocaters-photos-compressed";

const client = new S3Client({region: "us-west-1"});

/// Download the image from the elocaters-notes bucket and return the file path
/// where it was saved.
async function download_image(key: string): Promise<string> {
  let output =  await client.send(new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  }));

  const image_file_path = path.join(tempDir, key);
  const image_folder_path = path.dirname(image_file_path);

  fs.mkdirSync(image_folder_path, {recursive: true});

  let write_stream = fs.createWriteStream(image_file_path, {});
  output.Body.pipe(write_stream);

  return new Promise((
    resolve: (value: string) => void,
    reject: (reason: any) => void
  ) => {
    output.Body.on('error', reject);
    output.Body.on('end', () => {
      write_stream.close(),
      resolve(image_file_path);
    });
  });
}

/// Upload the provided thumbnail image to elocaters-photos-thumbnails.
async function upload_thumbnail(file_path: string, key: string): Promise<string> {
  await client.send(new PutObjectCommand({
    Bucket: thumbnail_bucket,
    Key: key,
    Body: fs.createReadStream(file_path),
  }));
  return key;
}

async function shrink_and_compress(file: string): Promise<string> {
  const file_path = path.parse(file);
  const output_file = path.join(file_path.dir, file_path.name + "_THUMB.webp");
  await Sharp(file)
    .resize({height: 768})
    .jpeg({mozjpeg: true, quality: 70})
    .toFile(output_file);
  return output_file;
}

/// Application entrypoint
export async function main(event: S3Event) {
  console.log("Got ", event.Records.length, " s3 records");
  let results = [];
  for (let record of event.Records) {
    const key = record.s3.object.key;
    const tmp_copy = await download_image(key);
    const compressed_file = await shrink_and_compress(tmp_copy);
    const output_key = await upload_thumbnail(compressed_file, key);
    console.log("Uploaded thumbnail to s3://" + thumbnail_bucket + "/" + key);
    results.push(output_key);
    fs.rmSync(tmp_copy);
  }
  return results;
}

