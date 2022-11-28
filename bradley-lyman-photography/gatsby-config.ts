import type { GatsbyConfig } from "gatsby";

const config: GatsbyConfig = {
  siteMetadata: {
    title: `Bradley Lyman Photography`,
    siteUrl: `https://www.yourdomain.tld`,
  },
  pathPrefix: "bradley-lyman-photography",
  // More easily incorporate content into your pages through automatic TypeScript type generation and better GraphQL IntelliSense.
  // If you use VSCode you can also use the GraphQL plugin
  // Learn more at: https://gatsby.dev/graphql-typegen
  graphqlTypegen: true,
  plugins: ["gatsby-plugin-vanilla-extract", "s3-photo-source"],
};

export default config;
