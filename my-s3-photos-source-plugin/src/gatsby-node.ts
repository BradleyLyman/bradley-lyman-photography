import sourceNodes from "./source_nodes";
import createResolvers from "./create_resolvers";
import { GatsbyNode, ParentSpanPluginArgs, PluginOptions } from "gatsby";

const onPreInit: GatsbyNode["onPreInit"] = (
  _args: ParentSpanPluginArgs,
  _options: PluginOptions
) => {
  console.info(`Hello world from my s3 photos plugin `);
};

exports.onPreInit = onPreInit;
exports.sourceNodes = sourceNodes;
exports.createResolvers = createResolvers;
