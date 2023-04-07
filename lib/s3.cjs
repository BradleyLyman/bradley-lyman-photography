const S3 = require("@aws-sdk/client-s3");
const { S3Client, ListObjectsV2Command } = S3;
const { AssetCache } = require("@11ty/eleventy-fetch");

/**
 * @typedef {Object} Album
 * @property {string} name
 * @property {string[]} photo_paths
 */

exports.S3PhotoArchive = class {
  /**
   * Create the photo archive.
   */
  constructor() {
    this.bucket = "bradley-lyman-photography-original";
    this.client = new S3Client({ region: "us-east-1" });
  }

  /**
   * @param {string} photo_object_name
   * @returns {string} the full https s3 object url
   */
  s3URL(photo_object_name) {
    return `https://${this.bucket}.s3.amazonaws.com/${photo_object_name}`;
  }

  /**
   * @returns {Promise<Album[]>}
   */
  async listAlbums() {
    const objects = await this.listObjects();
    let albums = {};
    objects.forEach((obj) => {
      let album = obj.split("/", 1)[0];
      if (!albums[album]) {
        albums[album] = {
          name: album,
          photo_paths: [],
        };
      }
      albums[album].photo_paths.push(obj);
    });
    return albums;
  }

  /**
   * @returns {Promise<string[]>}
   */
  async listObjects() {
    const asset = new AssetCache("s3_archive_list_objects");
    if (asset.isCacheValid("1d")) {
      return asset.getCachedValue();
    }

    let objects = await this._listObjectsRaw();
    await asset.save(objects, "json");

    return objects;
  }

  /**
   * @private
   * @param {string | undefined} prefix
   * @returns {Promise<string[]}
   */
  async _listObjectsRaw(prefix) {
    let results = [];
    let more_results = true;
    let params = {
      Bucket: this.bucket,
      MaxKeys: 200,
      Prefix: prefix,
    };
    while (more_results) {
      const output = await this.client.send(new ListObjectsV2Command(params));
      more_results = output.IsTruncated || false;
      params.ContinuationToken = output.NextContinuationToken;

      if (output.Contents) {
        output.Contents.forEach((object_in_bucket) => {
          if (object_in_bucket.Key) {
            results.push(object_in_bucket.Key);
          }
        });
      }
    }
    return results;
  }
};
