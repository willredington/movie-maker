import {
  aws_lambda,
  aws_stepfunctions as sfn,
  aws_stepfunctions_tasks as tasks,
} from "aws-cdk-lib";
import { Construct } from "constructs";
import { ProjectStatus } from "../model";
import { FargateConstruct } from "./fargate";

type StepFunctionConstructProps = {
  updateProjectLambda: aws_lambda.IFunction;
  getTranscriptLambda: aws_lambda.IFunction;
  textToAudioLambda: aws_lambda.IFunction;
  getGifLambda: aws_lambda.IFunction;
  updateSectionLambda: aws_lambda.IFunction;
  createResultLambda: aws_lambda.IFunction;
  fargateConstruct: FargateConstruct;
};

export class StepFunctionConstruct extends Construct {
  readonly startProjectStateMachine: sfn.StateMachine;
  readonly finalizeProjectStateMachine: sfn.StateMachine;

  constructor(scope: Construct, id: string, props: StepFunctionConstructProps) {
    super(scope, id);

    this.startProjectStateMachine = this.buildStartProjectStateMachine(
      scope,
      props
    );

    this.finalizeProjectStateMachine = this.buildFinalizeProjectStateMachine(
      scope,
      props
    );
  }

  private buildStartProjectStateMachine(
    scope: Construct,
    props: StepFunctionConstructProps
  ) {
    const failProjectTask = new tasks.LambdaInvoke(
      scope,
      "StartProjectFailProjectInvoke",
      {
        lambdaFunction: props.updateProjectLambda,
        payload: sfn.TaskInput.fromObject({
          projectId: sfn.JsonPath.stringAt("$.id"),
          userId: sfn.JsonPath.stringAt("$.userId"),
          projectStatus: ProjectStatus.Failed,
        }),
      }
    );

    const getTranscriptTask = new tasks.LambdaInvoke(
      scope,
      "GetTranscriptInvoke",
      {
        lambdaFunction: props.getTranscriptLambda,
        resultPath: "$.sections",
        payloadResponseOnly: true,
      }
    );

    const pendingApprovalTask = new tasks.LambdaInvoke(
      scope,
      "PendingApprovalInvoke",
      {
        lambdaFunction: props.updateProjectLambda,
        payload: sfn.TaskInput.fromObject({
          projectId: sfn.JsonPath.stringAt("$.id"),
          userId: sfn.JsonPath.stringAt("$.userId"),
          projectStatus: ProjectStatus.NeedsApproval,
        }),
      }
    );

    const definition = getTranscriptTask
      .next(pendingApprovalTask)
      .toSingleState("StartProjectDef")
      .addCatch(failProjectTask, {
        resultPath: "$.errors",
      });

    return new sfn.StateMachine(scope, "StartProjectStateMachine", {
      definition,
    });
  }

  private buildFinalizeProjectStateMachine(
    scope: Construct,
    props: StepFunctionConstructProps
  ) {
    const failProjectTask = new tasks.LambdaInvoke(
      scope,
      "FinalizeProjectFailProjectInvoke",
      {
        lambdaFunction: props.updateProjectLambda,
        payload: sfn.TaskInput.fromObject({
          projectId: sfn.JsonPath.stringAt("$.id"),
          userId: sfn.JsonPath.stringAt("$.userId"),
          projectStatus: ProjectStatus.Failed,
        }),
      }
    );

    const sectionTasks = new sfn.Map(scope, "SectionMap", {
      itemsPath: "$.sections",
      resultPath: "$.sectionResults",
    }).iterator(
      new tasks.LambdaInvoke(scope, "TextToAudioInvoke", {
        lambdaFunction: props.textToAudioLambda,
        resultPath: "$.audioResult",
        payloadResponseOnly: true,
      })
        .next(
          new tasks.LambdaInvoke(scope, "GetGifInvoke", {
            lambdaFunction: props.getGifLambda,
            resultPath: "$.gifResult",
            payloadResponseOnly: true,
          })
        )
        .next(
          new tasks.LambdaInvoke(scope, "UpdateSectionInvoke", {
            lambdaFunction: props.updateSectionLambda,
            payload: sfn.TaskInput.fromObject({
              sectionId: sfn.JsonPath.stringAt("$.id"),
              projectId: sfn.JsonPath.stringAt("$.projectId"),
              audioBucketLocation: sfn.JsonPath.stringAt("$.audioResult"),
              gifBucketLocation: sfn.JsonPath.stringAt("$.gifResult"),
            }),
          })
        )
    );

    const finalizingProjectTask = new tasks.LambdaInvoke(
      scope,
      "FinalizingProjectInvoke",
      {
        lambdaFunction: props.updateProjectLambda,
        payloadResponseOnly: true,
        resultPath: "$.finalizingProjectResult",
        payload: sfn.TaskInput.fromObject({
          userId: sfn.JsonPath.stringAt("$.userId"),
          projectId: sfn.JsonPath.stringAt("$.projectId"),
          projectStatus: ProjectStatus.Finalizing,
        }),
      }
    );

    const completeProjectTask = new tasks.LambdaInvoke(
      scope,
      "CompleteProjectInvoke",
      {
        lambdaFunction: props.updateProjectLambda,
        payload: sfn.TaskInput.fromObject({
          projectStatus: ProjectStatus.Completed,
          userId: sfn.JsonPath.stringAt("$.userId"),
          projectId: sfn.JsonPath.stringAt("$.movieMakerResult.projectId"),
        }),
      }
    );

    const createResultTask = new tasks.LambdaInvoke(
      scope,
      "CreateResultInvoke",
      {
        lambdaFunction: props.createResultLambda,
        payloadResponseOnly: true,
        resultPath: "$.createResult",
        payload: sfn.TaskInput.fromObject({
          userId: sfn.JsonPath.stringAt("$.userId"),
          projectId: sfn.JsonPath.stringAt("$.projectId"),
          videoBucketUrl: sfn.JsonPath.stringAt(
            "$.movieMakerResult.videoBucketUrl"
          ),
        }),
      }
    );

    const movieMakerTask = new tasks.EcsRunTask(scope, "MovieMakerEcsTask", {
      integrationPattern: sfn.IntegrationPattern.WAIT_FOR_TASK_TOKEN,
      assignPublicIp: false,
      launchTarget: new tasks.EcsFargateLaunchTarget(),
      cluster: props.fargateConstruct.cluster,
      taskDefinition: props.fargateConstruct.taskDefinition,
      resultPath: "$.movieMakerResult",
      containerOverrides: [
        {
          containerDefinition: props.fargateConstruct.containerDefinition,
          environment: [
            {
              name: "PROJECT_ID",
              value: sfn.JsonPath.stringAt("$.projectId"),
            },
            {
              name: "TASK_TOKEN",
              value: sfn.JsonPath.taskToken,
            },
          ],
        },
      ],
    });

    const definition = finalizingProjectTask
      .next(sectionTasks)
      .next(movieMakerTask)
      .next(createResultTask)
      .next(completeProjectTask)
      .toSingleState("FinalizeProjectDef")
      .addCatch(failProjectTask);

    return new sfn.StateMachine(scope, "FinalizeProjectStateMachine", {
      definition,
    });
  }
}
