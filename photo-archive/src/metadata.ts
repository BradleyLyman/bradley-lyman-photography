import { S3Client } from "@aws-sdk/client-s3";
import { listObjectPrefixes } from "./s3";

export interface AlbumMetadata {
  date: Date;
  name: string;
  prefix: string;
}

const KNOWN_ALBUMS: AlbumMetadata[] = [
  {
    date: new Date(2021, 11, 8),
    name: "Sunset Walk",
    prefix: "2021_11_08__SunsetWalk/",
  },
  {
    date: new Date(2021, 11, 26),
    name: "Sunrise Walk",
    prefix: "2021_11_26__SunriseWalk/",
  },
  {
    date: new Date(2021, 11, 26),
    name: "Sunset Walk",
    prefix: "2021_11_26__SunsetWalk/",
  },
  {
    date: new Date(2021, 12, 15),
    name: "Home For The Holidays",
    prefix: "2021_12_15__Evening__HomeForTheHolidays/",
  },
  {
    date: new Date(2021, 12, 16),
    name: "Home For The Holidays",
    prefix: "2021_12_16__Morning__HomeForTheHolidays/",
  },
  {
    date: new Date(2021, 12, 19),
    name: "Decorating The Tree",
    prefix: "2021_12_19__DecoratingTheTree__HomeForTheHolidays/",
  },
  {
    date: new Date(2021, 12, 21),
    name: "Clearbrook Park",
    prefix: "2021_12_21__ClearbrookPark__HomeForTheHolidays/",
  },
  {
    date: new Date(2021, 12, 24),
    name: "Gingerbread Houses",
    prefix: "2021_12_24__GingerbreadHouses__HomeForTheHolidays/",
  },
  {
    date: new Date(2021, 12, 25),
    name: "Christmas Day",
    prefix: "2021_12_25__ChristmasDay__HomeForTheHolidays/",
  },
  {
    date: new Date(2021, 12, 26),
    name: "At The Farm",
    prefix: "2021_12_26__AtTheFarm__HomeForTheHolidays/",
  },
  {
    date: new Date(2021, 12, 28),
    name: "Family Photos",
    prefix: "2021_12_28__FamilyPhotos__HomeForTheHolidays/",
  },
  {
    date: new Date(2021, 12, 29),
    name: "December 29",
    prefix: "2021_12_29/",
  },
  {
    date: new Date(2022, 5, 6),
    name: "Evening Walk",
    prefix: "2022_05_06_EveningWalk/",
  },
  {
    date: new Date(2022, 6, 15),
    name: "Maine Trip - Day 1",
    prefix: "2022_06_15_Maine_Trip/",
  },
  {
    date: new Date(2022, 6, 17),
    name: "Maine Trip - Day 2",
    prefix: "2022_06_17_Maine_Trip/",
  },
  {
    date: new Date(2022, 6, 22),
    name: "Maine Trip - Day 3",
    prefix: "2022_06_22_Maine_Trip/",
  },
];

const ALBUM_PREFIX_MAP: Map<string, AlbumMetadata> = KNOWN_ALBUMS.reduce(
  (
    total: Map<string, AlbumMetadata>,
    album: AlbumMetadata
  ): Map<string, AlbumMetadata> => {
    total.set(album.prefix, album);
    return total;
  },
  new Map<string, AlbumMetadata>()
);

export const listAlbumMetadata = async (): Promise<AlbumMetadata[]> => {
  const client = new S3Client({ region: "us-east-1" });
  const prefixes = await listObjectPrefixes(
    client,
    "bradley-lyman-photography-original"
  );
  let albums: AlbumMetadata[] = [];
  for (const prefix of prefixes) {
    if (!ALBUM_PREFIX_MAP.has(prefix)) {
      throw new Error(`Unknown album prefix! "${prefix}"`);
    }
    albums.push(ALBUM_PREFIX_MAP.get(prefix)!);
  }
  return albums;
};
