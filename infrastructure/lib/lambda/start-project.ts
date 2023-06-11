import { APIGatewayProxyHandler } from "aws-lambda";
import { StepFunctions } from "aws-sdk";
import { RunTimeEnvVariable, getEnvVariable } from "../config";
import { ProjectService } from "../service/project";
import { z } from "zod";
import { ProjectStatus } from "../model";

const stepFunctions = new StepFunctions();

const IncomingEvent = z.object({
  topic: z.string().nonempty(),
});

export const handler: APIGatewayProxyHandler = async (incomingEvent) => {
  console.log(incomingEvent);
  const eventResult = IncomingEvent.safeParse(
    JSON.parse(incomingEvent.body ?? "")
  );

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
    const projectsForUser = (
      await projectService.getProjectsForUser({
        userId: "user-1",
      })
    )
      .mapErr(() => "failed to get projects for user")
      .unwrap();

    const hasActiveProjects = projectsForUser.some(
      (project) =>
        ![ProjectStatus.Completed, ProjectStatus.Failed].includes(
          project.status
        )
    );

    if (hasActiveProjects) {
      return {
        statusCode: 409,
        body: "User has project already active",
      };
    }

    const project = (
      await projectService.createProject({
        topic: eventResult.data.topic,
        userId: "user-1",
      })
    )
      .mapErr(() => "failed to create project")
      .unwrap();

    await stepFunctions
      .startExecution({
        input: JSON.stringify(project),
        stateMachineArn: getEnvVariable(
          RunTimeEnvVariable.START_PROJECT_STATE_MACHINE_ARN
        ),
      })
      .promise();

    return {
      statusCode: 201,
      body: JSON.stringify(project),
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
