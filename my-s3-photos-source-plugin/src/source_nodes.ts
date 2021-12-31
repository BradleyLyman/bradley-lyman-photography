import { GatsbyNode, SourceNodesArgs, PluginOptions } from "gatsby";
import { get_all_remote_images } from "./remote_image_node";
import { RemoteImage } from "my-s3-photos-types";

export const NODE_TYPE: string = `MyS3Image`;

/**
 * sourceNodes is the GatsbyJS api for injecting data into the GraphQL Data
 * layer.
 *
 * This plugin queries S3 to get the list of all pictures in the bucket, then
 * dispatches requests to Lambda to generate/retrieve the metadata for each
 * image.
 */
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

  // Use s3+lambda to get the list of all RemoteImage structures
  const data = await get_all_remote_images(bucket);

  // transform RemoteImage structures into graphql nodes
  const nodes = data.map(async (image_promise: Promise<RemoteImage>) => {
    let image = await image_promise;
    let id = createNodeId(`${NODE_TYPE}-${image.id}`);
    let folder: string = image.key.split("/")[0];
    console.log(`GOT FOLDER: ${folder}`);
    createNode({
      ...image,
      folder: folder,
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
