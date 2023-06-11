import { APIGatewayProxyHandler } from "aws-lambda";
import { StepFunctions } from "aws-sdk";
import { RunTimeEnvVariable, getEnvVariable } from "../config";
import { z } from "zod";
import { ProjectService } from "../service/project";
import { ProjectStatus } from "../model";

const stepFunctions = new StepFunctions();

const IncomingEvent = z.object({
  projectId: z.string().nonempty(),
});

type FinalizeProjectStateMachineInput = {
  projectId: string;
};

export const handler: APIGatewayProxyHandler = async (incomingEvent) => {
  console.log(incomingEvent);
  const eventResult = IncomingEvent.safeParse(incomingEvent.pathParameters);

  if (!eventResult.success) {
    return {
      statusCode: 400,
      body: "Invalid request body",
    };
  }

  const projectService = new ProjectService(
    getEnvVariable(RunTimeEnvVariable.PROJECT_TABLE_NAME)
  );

  try {
    const project = (
      await projectService.getProject({
        userId: "user-1",
        id: eventResult.data.projectId,
      })
    )
      .mapErr(() => "Could not find project")
      .unwrap();

    if (project.status !== ProjectStatus.NeedsApproval) {
      return {
        statusCode: 409,
        body: "Project not in a valid state",
      };
    }

    await stepFunctions
      .startExecution({
        input: JSON.stringify({
          projectId: eventResult.data.projectId,
        } satisfies FinalizeProjectStateMachineInput),
        stateMachineArn: getEnvVariable(
          RunTimeEnvVariable.FINALIZE_PROJECT_STATE_MACHINE_ARN
        ),
      })
      .promise();

    return {
      statusCode: 201,
      body: "Created",
    };
  } catch (err) {
    console.error("failed to send event", err);
    return {
      statusCode: 500,
      body: "Something went wrong",
    };
  }
};

export default handler;
