#!/usr/bin/env node

import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { ElocatersPhotosStack } from "../lib/elocaters_photos_stack";
import { ElocatersPhotosBuckets } from "../lib/elocaters_photos_buckets";

let env: cdk.Environment = {
  account: "451738990703",
  region: "us-west-2",
};

const app = new cdk.App();

let buckets = new ElocatersPhotosBuckets(app, "ElocatersPhotosBuckets", {
  env,
});

new ElocatersPhotosStack(app, "ElocatersPhotosStack", buckets.originals, {
  env,
});
