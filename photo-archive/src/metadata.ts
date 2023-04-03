import { S3Client } from "@aws-sdk/client-s3";
import { listObjectPrefixes, listObjects } from "./s3";

export interface AlbumMetadata {
  /** A unique id for the album. */
  id: string;
  photo_paths: string[];
}

/**
 * List metadata for every album.
 **/
export const listAlbumMetadata = async (): Promise<AlbumMetadata[]> => {
  const client = new S3Client({ region: "us-east-1" });
  const prefixes = await listObjectPrefixes(
    client,
    "bradley-lyman-photography-original"
  );
  let albums: AlbumMetadata[] = [];
  for (const prefix of prefixes) {
    let objects = await listObjects(
      client,
      "bradley-lyman-photography-original",
      prefix
    );
    let photos = objects.filter((value) => value.endsWith(".JPG"));
    albums.push({
      id: prefix.replace("/", ""),
      photo_paths: photos,
    });
  }
  return albums;
};
