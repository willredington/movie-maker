import { aws_s3 as s3 } from "aws-cdk-lib";
import { Construct } from "constructs";

export class BucketConstruct extends Construct {
  readonly audioBucket: s3.Bucket;
  readonly gifBucket: s3.Bucket;
  readonly videoBucket: s3.Bucket;

  constructor(scope: Construct, id: string) {
    super(scope, id);
    this.audioBucket = new s3.Bucket(scope, "AudioBucket");
    this.gifBucket = new s3.Bucket(scope, "GIFBucket");
    this.videoBucket = new s3.Bucket(scope, "VideoBucket");
  }
}
