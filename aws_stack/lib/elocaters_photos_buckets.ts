import { Stack, StackProps, Duration, RemovalPolicy } from "aws-cdk-lib";
import * as s3 from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";

export class ElocatersPhotosBuckets extends Stack {
  originals: s3.Bucket;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    this.originals = new s3.Bucket(this, "elocaters-photos-original", {
      publicReadAccess: true,
      bucketName: "elocaters-photos-original",
      removalPolicy: RemovalPolicy.RETAIN,
    });
  }
}
