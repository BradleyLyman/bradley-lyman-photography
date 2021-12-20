import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import {S3Client, GetObjectCommand, PutObjectCommand} from '@aws-sdk/client-s3';
import Sharp from 'sharp';

const test_event = {
  "Records": [
    {
      "eventVersion": "2.0",
      "eventSource": "aws:s3",
      "awsRegion": "us-east-1",
      "eventTime": "1970-01-01T00:00:00.000Z",
      "eventName": "ObjectCreated:Put",
      "userIdentity": {
        "principalId": "EXAMPLE"
      },
      "requestParameters": {
        "sourceIPAddress": "127.0.0.1"
      },
      "responseElements": {
        "x-amz-request-id": "EXAMPLE123456789",
        "x-amz-id-2": "EXAMPLE123/5678abcdefghijklambdaisawesome/mnopqrstuvwxyzABCDEFGH"
      },
      "s3": {
        "s3SchemaVersion": "1.0",
        "configurationId": "testConfigRule",
        "bucket": {
          "name": "example-bucket",
          "ownerIdentity": {
            "principalId": "EXAMPLE"
          },
          "arn": "arn:aws:s3:::example-bucket"
        },
        "object": {
          "key": "test%2Fkey",
          "size": 1024,
          "eTag": "0123456789abcdef0123456789abcdef",
          "sequencer": "0A1B2C3D4E5F678901"
        }
      }
    }
  ]
};


const appname = "elocaters_photos_thumbnails";
const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), appname));
const bucket= "elocaters-photos";
const thumbnail_bucket = "elocaters-photos-compressed";
//const key = "2021_12_19__DecoratingTheTree__HomeForTheHolidays/2021_12_19_DecoratingTheTree_0412.JPG";
const key = "2021_11_08__SunsetWalk/Sunset_Walk_2021_11_08_0001.JPG";

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
async function main() {
  const file = await download_image(key);
  const thumb_file_path = await shrink_and_compress(file);
  const output_key = await upload_thumbnail(thumb_file_path, key);
  console.log(output_key);
}

main().then(
 () => {console.log("done!");},
 (err: any) => {console.error("An Error occurred!", err); return err;}
);
