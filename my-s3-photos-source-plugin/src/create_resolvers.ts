import {
  generateImageData,
  IGatsbyImageHelperArgs,
  ImageFormat,
  Layout,
} from "gatsby-plugin-image";
import { getGatsbyImageResolver } from "gatsby-plugin-image/graphql-utils";
import { RemoteImage } from "./remote_image_node";
import { CreateResolversArgs } from "gatsby";

const generateImageSource: IGatsbyImageHelperArgs["generateImageSource"] = (
  baseURL: string,
  width: number,
  height: number,
  format: ImageFormat,
  fit: string,
  options: Record<string, unknown>
) => {
  console.info(`Generate Image Source for ${baseURL}`);
  console.group();
  console.info(`WxH: ${width}x${height}`);
  console.info(`Format: ${format}`);
  console.info(`Fit: ${fit}`);
  console.info(`Other Options: ${JSON.stringify(options)}`);
  console.groupEnd();
  const src = `https://CDN-DNS/${baseURL}_${width}_${height}.${format}`;
  return { src, width, height, format };
};

export interface ResolveImageDataOpts {
  layout: Layout;
  width: number;
  height: number;
  placeholder: string;
  something_bonkers: string;
}

const resolveGatsbyImageData = async (
  image: RemoteImage,
  options: ResolveImageDataOpts
) => {
  const filename = image.key;

  const imageDataArgs: IGatsbyImageHelperArgs = {
    ...options,
    pluginName: `my-s3-photos-source-plugin`,
    sourceMetadata: {
      width: image.width,
      height: image.height,
      format: image.format,
    },
    filename,
    placeholderURL: filename,
    generateImageSource,
  };

  if (options.placeholder == "blurred") {
    // Do something better
    console.warn("'generating' a blurred placeholder");
    imageDataArgs.placeholderURL = "A blurred placeholder url";
  }

  return generateImageData(imageDataArgs);
};

export default function createResolvers({
  createResolvers,
}: CreateResolversArgs) {
  console.warn("CREATING RESOLVER?!?");
  createResolvers({
    MyS3Image: {
      gatsbyImageData: getGatsbyImageResolver(resolveGatsbyImageData, {
        layout: "String",
        width: "Int",
        height: "Int",
        placeholder: "String",
        something_bonkers: "String",
      }),
    },
  });
}
