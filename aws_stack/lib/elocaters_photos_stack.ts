import { Stack, StackProps, Duration } from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as s3 from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import * as path from "path";
import * as iam from "aws-cdk-lib/aws-iam";

export class ElocatersPhotosStack extends Stack {
  constructor(
    scope: Construct,
    id: string,
    originals_bucket: s3.Bucket,
    props?: StackProps
  ) {
    super(scope, id, props);

    const sharp_layer = new lambda.LayerVersion(this, "my-sharp-layer", {
      code: lambda.Code.fromAsset("sharp_layer.zip"),
    });

    let get_remote_image_role = new iam.Role(this, "get_remote_image_role", {
      assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com"),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName(
          "service-role/AWSLambdaBasicExecutionRole"
        ),
        iam.ManagedPolicy.fromAwsManagedPolicyName(
          "service-role/AWSLambdaVPCAccessExecutionRole"
        ),
      ],
    });

    let get_remote_image_function = new NodejsFunction(
      this,
      "get_remote_image",
      {
        functionName: "get_remote_image",
        memorySize: 2048,
        timeout: Duration.seconds(5),
        runtime: lambda.Runtime.NODEJS_14_X,
        handler: "get_remote_image",
        entry: path.join(__dirname, "../resources/my-example-lambda/index.ts"),
        bundling: {
          forceDockerBundling: true,
          minify: true,
          externalModules: ["sharp"],
        },
        layers: [sharp_layer],
        role: get_remote_image_role,
      }
    );

    originals_bucket.grantReadWrite(get_remote_image_role);
    originals_bucket.addToResourcePolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        principals: [new iam.StarPrincipal()],
        actions: ["s3:GetObject", "s3:GetObjectVersion", "s3:ListBucket"],
        resources: [
          `arn:aws:s3:::${originals_bucket.bucketName}`,
          `arn:aws:s3:::${originals_bucket.bucketName}/*`,
        ],
      })
    );
  }
}
