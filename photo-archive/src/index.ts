import { listAlbumMetadata, AlbumMetadata } from "./metadata";

export { listAlbumMetadata, AlbumMetadata };

listAlbumMetadata().then((albums) => {
  console.log(JSON.stringify(albums, null, 2));
});
