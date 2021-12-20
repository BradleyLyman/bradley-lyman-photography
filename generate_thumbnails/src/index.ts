import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import {S3Client, GetObjectCommand, GetObjectCommandInput} from '@aws-sdk/client-s3';

const appname = "elocaters_photos_thumbnails";
const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), appname));
const key = "2021_11_08__SunsetWalk/Sunset_Walk_2021_11_08_0001.JPG";

const client = new S3Client({region: "us-west-1"});

/// Download the image from the elocaters-notes bucket and return the file path
/// where it was saved.
async function download_image(key: string): Promise<string> {
  let output =  await client.send(new GetObjectCommand({
    Bucket: "elocaters-photos",
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

/// Application entrypoint
async function main() {
  console.log(await download_image(key));
}

main().then(
 () => {console.log("done!");},
 (err: any) => {console.error("An Error occurred!", err); return err;}
);
