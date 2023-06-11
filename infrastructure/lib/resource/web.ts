import {
  RemovalPolicy,
  aws_s3 as s3,
  aws_s3_deployment as s3_deployment,
} from "aws-cdk-lib";
import { Construct } from "constructs";

export class WebConstruct extends Construct {
  readonly websiteBucket: s3.Bucket;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    this.websiteBucket = new s3.Bucket(scope, "WebBucket", {
      publicReadAccess: true,
      enforceSSL: true,
      websiteIndexDocument: "index.html",
    });

    new s3_deployment.BucketDeployment(scope, "WebBucketDeployment", {
      // TODO
    });
  }
}
