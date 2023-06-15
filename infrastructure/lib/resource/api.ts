import { Duration, aws_apigateway as apig, aws_lambda } from "aws-cdk-lib";
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

    this.api = new apig.RestApi(scope, "Api", {
      defaultCorsPreflightOptions: {
        allowOrigins: apig.Cors.ALL_ORIGINS,
        allowMethods: apig.Cors.ALL_METHODS,
      },
    });

    const authorizer = new apig.TokenAuthorizer(this, "TokenAuthorizer", {
      handler: props.authLambda,
      resultsCacheTtl: Duration.seconds(0),
    });

    const gifResource = this.api.root.addResource("gif");
    const resultResource = this.api.root.addResource("result");
    const projectResource = this.api.root.addResource("project");
    const projectsResource = this.api.root.addResource("projects");

    const defaultMethodOptions: apig.MethodOptions = {
      authorizer,
      authorizationType: apig.AuthorizationType.CUSTOM,
    };

    projectResource.addMethod(
      "POST",
      new apig.LambdaIntegration(props.startProjectLambda),
      defaultMethodOptions
    );

    projectResource
      .addResource("{projectId}")
      .addMethod(
        "PUT",
        new apig.LambdaIntegration(props.finalizeProjectLambda),
        defaultMethodOptions
      );

    projectsResource.addMethod(
      "GET",
      new apig.LambdaIntegration(props.getProjectsLambda),
      defaultMethodOptions
    );

    resultResource
      .addResource("{projectId}")
      .addMethod(
        "GET",
        new apig.LambdaIntegration(props.getResultLambda),
        defaultMethodOptions
      );

    gifResource.addMethod(
      "GET",
      new apig.LambdaIntegration(props.searchGifLambda),
      defaultMethodOptions
    );
  }
}
