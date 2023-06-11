import {
  aws_dynamodb as dynamo,
  aws_ec2 as ec2,
  aws_ecs as ecs,
  aws_iam as iam,
  aws_s3 as s3,
} from "aws-cdk-lib";
import { Construct } from "constructs";
import { RunTimeEnvVariable } from "../config";

type FargateConstructProps = {
  audioBucket: s3.IBucket;
  gifBucket: s3.IBucket;
  videoBucket: s3.IBucket;
  projectSectionTable: dynamo.ITable;
};

export class FargateConstruct extends Construct {
  readonly cluster: ecs.Cluster;
  readonly taskDefinition: ecs.TaskDefinition;
  readonly containerDefinition: ecs.ContainerDefinition;

  constructor(scope: Construct, id: string, props: FargateConstructProps) {
    super(scope, id);

    const logging = new ecs.AwsLogDriver({
      streamPrefix: "movie-maker",
    });

    const vpc = new ec2.Vpc(scope, "FargateVpc", {
      maxAzs: 2,
    });

    this.cluster = new ecs.Cluster(scope, "FargateCluster", {
      vpc,
    });

    const taskRole = new iam.Role(scope, "FargateTaskRole", {
      assumedBy: new iam.ServicePrincipal("ecs-tasks.amazonaws.com"),
    });

    props.audioBucket.grantRead(taskRole);
    props.gifBucket.grantRead(taskRole);
    props.videoBucket.grantReadWrite(taskRole);
    props.projectSectionTable.grantReadData(taskRole);

    this.taskDefinition = new ecs.FargateTaskDefinition(
      scope,
      "FargateTaskDef",
      {
        taskRole,
        memoryLimitMiB: 4096,
        cpu: 2048,
      }
    );

    this.containerDefinition = this.taskDefinition.addContainer(
      "FargateContainer",
      {
        logging,
        image: ecs.ContainerImage.fromRegistry(
          "will86325/movie-maker-task:latest"
        ),
        environment: {
          [RunTimeEnvVariable.VIDEO_BUCKET_NAME]: props.videoBucket.bucketName,
          [RunTimeEnvVariable.SECTION_TABLE_NAME]:
            props.projectSectionTable.tableName,
        },
      }
    );
  }
}
