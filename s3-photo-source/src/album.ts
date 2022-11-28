export class Album {
  private name: String;
  private image_keys: String[];

  constructor(name: String) {
    this.name = name;
    this.image_keys = [];
  }

  add_image_key(image_key: String) {
    this.image_keys.push(image_key);
  }

  image_count(): number {
    return this.image_keys.length;
  }
}

/**
 * Create a list of Albums based on the provided S3 object keys.
 * Only .jpg images are included in albums.
 **/
export function createAlbums(object_keys: String[]): Album[] {
  let albums = new Map<String, Album>();

  for (let object of object_keys) {
    if (!object.endsWith(".JPG")) {
      continue;
    }

    let album_name = object.split("/")[0];
    if (!albums.has(album_name)) {
      albums.set(album_name, new Album(album_name));
    }
    albums.get(album_name)!.add_image_key(object);
  }

  return [...albums.values()];
}
