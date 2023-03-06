import type { GatsbyNode, SourceNodesArgs } from "gatsby";
import { listAllObjects } from "./s3-client";
import { createAlbums } from "./album";

export const sourceNodes: GatsbyNode["sourceNodes"] = async (
  args: SourceNodesArgs
) => {
  console.log("SOURCE NODES FROM MY PLUGIN");

  let albums = createAlbums(await listAllObjects());

  const { createNodeId, createContentDigest } = args;
  const { createNode } = args.actions;

  for (let album of albums) {
    let album_id = createNodeId(`album_${album.get_name()}`);

    let image_ids = [];
    for (let key of album.get_image_keys()) {
      let id = createNodeId(`photo_${key}`);
      image_ids.push(id);

      createNode({
        key: key,

        parent: album_id,
        children: [],
        id: id,
        internal: {
          type: "Photo",
          contentDigest: createContentDigest(`${key}`),
        },
      });
    }

    await createNode({
      name: album.get_name(),

      parent: null,
      children: image_ids,
      id: album_id,
      internal: {
        type: "Album",
        contentDigest: createContentDigest(
          `${album.get_name()}_${album.get_image_keys().length}`
        ),
        content: album.get_name(),
      },
    });
  }
};
