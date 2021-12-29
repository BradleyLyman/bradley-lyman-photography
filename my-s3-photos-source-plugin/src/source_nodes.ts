import { GatsbyNode, SourceNodesArgs, PluginOptions } from "gatsby";
import { RemoteImage, get_all_remote_images } from "./remote_image_node";

export const NODE_TYPE: string = `MyS3Image`;

const sourceNodes: GatsbyNode["sourceNodes"] = async (
  {
    actions: { createNode },
    createContentDigest,
    createNodeId,
  }: SourceNodesArgs,
  options: PluginOptions
) => {
  const bucket: string = options["bucket"] as string;
  console.info(`Use s3 bucket: ${bucket}`);

  const data = await get_all_remote_images(bucket);

  const nodes = data.map(async (image_promise: Promise<RemoteImage>) => {
    let image = await image_promise;
    let id = createNodeId(`${NODE_TYPE}-${image.id}`);
    createNode({
      ...image,
      id,
      parent: null,
      children: [],
      internal: {
        type: NODE_TYPE,
        content: JSON.stringify(image),
        contentDigest: createContentDigest(image),
      },
    });
  });

  await Promise.all(nodes);

  return;
};

export default sourceNodes;
