const { withSuperjson } = require("next-superjson");

const isGithubActions = process.env.GITHUB_ACTIONS || "";

let assetPrefix = undefined;
let basePath = "";

if (isGithubActions.length > 0) {
  // trim off `<owner>/`
  const repo = process.env.GITHUB_REPOSITORY.replace(/.*?\//, "");

  assetPrefix = `/${repo}/`;
  basePath = `/${repo}`;
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  assetPrefix: assetPrefix,
  basePath: basePath,
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
};

console.log("config dump: ", JSON.stringify(nextConfig, null, 2));

module.exports = withSuperjson()(nextConfig);
