import { APIGatewayProxyHandler } from "aws-lambda";
import { RunTimeEnvVariable, getEnvVariable } from "../config";
import { ProjectService } from "../service/project";
import { DEFAULT_JSON_HTTP_HEADERS, DEFAULT_TEXT_HTTP_HEADERS } from "../utils";
import { getAuthFromEvent } from "../service/auth";

export const handler: APIGatewayProxyHandler = async (proxyEvent) => {
  const { userId } = getAuthFromEvent(proxyEvent);

  const projectService = new ProjectService(
    getEnvVariable(RunTimeEnvVariable.PROJECT_TABLE_NAME)
  );

  try {
    const projectsForUser = (
      await projectService.getProjectsForUser({
        userId,
      })
    ).unwrap();

    return {
      statusCode: 200,
      headers: DEFAULT_JSON_HTTP_HEADERS,
      body: JSON.stringify(projectsForUser),
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      headers: DEFAULT_TEXT_HTTP_HEADERS,
      body: "An unknown error occurred",
    };
  }
};

export default handler;
