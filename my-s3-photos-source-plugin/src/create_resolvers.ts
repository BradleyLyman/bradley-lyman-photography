import {
  generateImageData,
  IGatsbyImageHelperArgs,
  IImage,
  ImageFormat,
  Layout,
} from "gatsby-plugin-image";
import { getGatsbyImageResolver } from "gatsby-plugin-image/graphql-utils";
import { RemoteImage } from "my-s3-photos-types";
import { CreateResolversArgs } from "gatsby";

export interface ResolveImageDataOpts {
  layout: Layout;
  width: number;
  height: number;
  placeholder: string;
  quality: number;
}

const resolveGatsbyImageData = async (
  image: RemoteImage,
  options: ResolveImageDataOpts
) => {
  const filename = image.key;

  let params = [];

  const generateImageSource: IGatsbyImageHelperArgs["generateImageSource"] = (
    baseURL: string,
    width: number,
    height: number,
    format: ImageFormat,
    _fit: string,
    _options: Record<string, unknown>
  ): IImage => {
    params.push({
      width,
      height,
      format,
      baseURL,
    });
    const src = `https://elocaters-photos-original.s3.us-west-2.amazonaws.com/${baseURL}`;
    //_${width}_${height}.${format}`;
    return { src, width, height, format };
  };

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

  let result = generateImageData(imageDataArgs);

  console.log(`GOT PARAMS ${JSON.stringify(params, null, 4)}`);

  /* wait for generation tasks to complete */

  return result;
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
        quality: "Int",
      }),
    },
  });
}
