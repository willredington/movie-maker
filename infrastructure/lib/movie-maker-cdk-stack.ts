import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { ProjectConfig } from "./config";
import { ApiConstruct } from "./resource/api";
import { BucketConstruct } from "./resource/bucket";
import { FargateConstruct } from "./resource/fargate";
import * as lambdas from "./resource/lambda";
import { StepFunctionConstruct } from "./resource/step-function";
import { TableConstruct } from "./resource/table";

type MovieMakerCdkStackProps = cdk.StackProps & {
  projectConfig: ProjectConfig;
};

export class MovieMakerCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: MovieMakerCdkStackProps) {
    super(scope, id, props);
    this.initializeAsync(props.projectConfig).then(() => {
      console.log("Stack initialization complete");
    });
  }

  private async initializeAsync(projectConfig: ProjectConfig) {
    const buckets = new BucketConstruct(this, "BucketConstruct");

    const tables = new TableConstruct(this, "TableConstruct");

    const authLambda = await lambdas.buildAuthLambda(this, { projectConfig });

    const searchGifLambda = await lambdas.buildSearchGifLambda(this, {
      projectConfig,
    });

    const textToAudioLambda = await lambdas.buildTextToAudioLambda(this, {
      projectConfig,
      audioBucket: buckets.audioBucket,
      projectSectionTable: tables.projectSectionTable,
    });

    const getTranscriptLambda = await lambdas.buildGetTranscriptLambda(this, {
      projectConfig,
      projectSectionTable: tables.projectSectionTable,
    });

    const getGifLambda = await lambdas.buildGetGifLambda(this, {
      projectConfig,
      gifBucket: buckets.gifBucket,
      projectSectionTable: tables.projectSectionTable,
    });

    const updateSectionLambda = await lambdas.buildUpdateSectionLambda(this, {
      projectConfig,
      projectSectionTable: tables.projectSectionTable,
    });

    const updateProjectLambda = await lambdas.buildUpdateProjectLambda(this, {
      projectConfig,
      projectTable: tables.projectTable,
    });

    const fargateConstruct = new FargateConstruct(this, "FargateConstruct", {
      audioBucket: buckets.audioBucket,
      gifBucket: buckets.gifBucket,
      videoBucket: buckets.videoBucket,
      projectSectionTable: tables.projectSectionTable,
    });

    const createResultLambda = await lambdas.buildCreateResultLambda(this, {
      projectConfig,
      resultTable: tables.projectResultTable,
    });

    const getResultLambda = await lambdas.buildGetResultLambda(this, {
      projectConfig,
      videoBucket: buckets.videoBucket,
      resultTable: tables.projectResultTable,
    });

    const stateMachine = new StepFunctionConstruct(
      this,
      "StepFunctionConstruct",
      {
        getGifLambda,
        getTranscriptLambda,
        textToAudioLambda,
        updateProjectLambda,
        updateSectionLambda,
        createResultLambda,
        fargateConstruct,
      }
    );

    // NOTE: avoids circular dependency
    stateMachine.finalizeProjectStateMachine.grantTaskResponse(
      fargateConstruct.taskDefinition.taskRole
    );

    const startProjectLambda = await lambdas.buildStartProjectLambda(this, {
      projectConfig,
      projectTable: tables.projectTable,
      startProjectStateMachine: stateMachine.startProjectStateMachine,
    });

    const finalizeProjectLambda = await lambdas.buildFinalizeProjectEventLambda(
      this,
      {
        projectConfig,
        projectTable: tables.projectTable,
        projectSectionTable: tables.projectSectionTable,
        finalizeProjectStateMachine: stateMachine.finalizeProjectStateMachine,
      }
    );

    const getProjectsLambda = await lambdas.buildGetProjectsLambda(this, {
      projectConfig,
      projectTable: tables.projectTable,
    });

    const getProjectLambda = await lambdas.buildGetProjectLambda(this, {
      projectConfig,
      projectTable: tables.projectTable,
      sectionTable: tables.projectSectionTable,
    });

    new ApiConstruct(this, "ApiConstruct", {
      authLambda,
      startProjectLambda,
      finalizeProjectLambda,
      searchGifLambda,
      getProjectsLambda,
      getProjectLambda,
      getResultLambda,
    });
  }
}
