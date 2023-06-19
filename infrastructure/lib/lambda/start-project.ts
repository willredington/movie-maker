import { APIGatewayProxyHandler } from "aws-lambda";
import { StepFunctions } from "aws-sdk";
import { z } from "zod";
import { RunTimeEnvVariable, getEnvVariable } from "../config";
import { ProjectStatus } from "../model";
import { ProjectService } from "../service/project";
import { DEFAULT_JSON_HTTP_HEADERS, DEFAULT_TEXT_HTTP_HEADERS } from "../utils";
import { getAuthFromEvent } from "../service/auth";

const stepFunctions = new StepFunctions();

const IncomingEvent = z.object({
  topic: z.string().nonempty(),
});

export const handler: APIGatewayProxyHandler = async (proxyEvent) => {
  const { userId } = getAuthFromEvent(proxyEvent);

  const eventResult = IncomingEvent.safeParse(
    JSON.parse(proxyEvent.body ?? "")
  );

  if (!eventResult.success) {
    return {
      statusCode: 400,
      headers: DEFAULT_TEXT_HTTP_HEADERS,
      body: "Invalid request body",
    };
  }

  const projectService = new ProjectService(
    getEnvVariable(RunTimeEnvVariable.PROJECT_TABLE_NAME)
  );

  try {
    const projectsForUser = (
      await projectService.getProjectsForUser({
        userId,
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
        headers: DEFAULT_TEXT_HTTP_HEADERS,
        body: "User has project already active",
      };
    }

    const project = (
      await projectService.createProject({
        topic: eventResult.data.topic,
        userId,
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
      headers: DEFAULT_JSON_HTTP_HEADERS,
      body: JSON.stringify(project),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: DEFAULT_TEXT_HTTP_HEADERS,
      body: "Something went wrong",
    };
  }
};

export default handler;
