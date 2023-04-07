const { S3PhotoArchive } = require("./../../lib/s3.cjs");

module.exports = async () => {
  const archive = new S3PhotoArchive();
  const albums = await archive.listAlbums();

  return {
    all_photo_albums: albums,
    something: "hello world",
  };
};
