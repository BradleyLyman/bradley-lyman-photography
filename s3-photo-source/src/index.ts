import { createAlbums } from "./album";
import { listAllObjects } from "./s3-client";

(async function main() {
  let all_objects = await listAllObjects();
  let albums = createAlbums(all_objects);
  console.log(albums);
})();
