import { aws_apigateway as apig, aws_lambda } from "aws-cdk-lib";
import { Construct } from "constructs";

type ApiConstructProps = {
  authLambda: aws_lambda.IFunction;
  startProjectLambda: aws_lambda.IFunction;
  finalizeProjectLambda: aws_lambda.IFunction;
  searchGifLambda: aws_lambda.IFunction;
  getProjectsLambda: aws_lambda.IFunction;
  getResultLambda: aws_lambda.IFunction;
};

export class ApiConstruct extends Construct {
  readonly api: apig.RestApi;

  constructor(scope: Construct, id: string, props: ApiConstructProps) {
    super(scope, id);

    this.api = new apig.RestApi(scope, "Api");

    // const authorizer = new apig.TokenAuthorizer(this, "TokenAuthorizer", {
    //   handler: authLambda,
    // });

    const gifResource = this.api.root.addResource("gif");

    gifResource.addMethod(
      "GET",
      new apig.LambdaIntegration(props.searchGifLambda)
    );

    const projectResource = this.api.root.addResource("project");
    const projectsResource = this.api.root.addResource("projects");
    const resultResource = this.api.root.addResource("result");

    projectResource
      .addResource("{projectId}")
      .addMethod(
        "PUT",
        new apig.LambdaIntegration(props.finalizeProjectLambda)
      );

    projectResource.addMethod(
      "POST",
      new apig.LambdaIntegration(props.startProjectLambda)
    );

    projectsResource.addMethod(
      "GET",
      new apig.LambdaIntegration(props.getProjectsLambda)
      // {
      //   authorizer,
      // }
    );

    resultResource
      .addResource("{projectId}")
      .addMethod("GET", new apig.LambdaIntegration(props.getResultLambda));
  }
}
