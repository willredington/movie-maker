import { aws_dynamodb as dynamo } from "aws-cdk-lib";
import { Construct } from "constructs";

export class TableConstruct extends Construct {
  readonly projectTable: dynamo.Table;
  readonly projectResultTable: dynamo.Table;
  readonly projectSectionTable: dynamo.Table;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    this.projectResultTable = new dynamo.Table(scope, "ProjectResultTable", {
      partitionKey: { name: "projectId", type: dynamo.AttributeType.STRING },
    });

    this.projectTable = new dynamo.Table(scope, "ProjectTable", {
      partitionKey: { name: "userId", type: dynamo.AttributeType.STRING },
      sortKey: {
        name: "id",
        type: dynamo.AttributeType.STRING,
      },
    });

    this.projectSectionTable = new dynamo.Table(scope, "ProjectSectionTable", {
      partitionKey: { name: "projectId", type: dynamo.AttributeType.STRING },
      sortKey: {
        name: "id",
        type: dynamo.AttributeType.STRING,
      },
    });
  }
}
