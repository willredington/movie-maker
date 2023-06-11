import { APIGatewayProxyHandler } from "aws-lambda";
import { RunTimeEnvVariable, getEnvVariable } from "../config";
import { ProjectService } from "../service/project";

export const handler: APIGatewayProxyHandler = async () => {
  const projectService = new ProjectService(
    getEnvVariable(RunTimeEnvVariable.PROJECT_TABLE_NAME)
  );

  try {
    const projectsForUser = (
      await projectService.getProjectsForUser({
        userId: "user-1",
      })
    ).unwrap();

    return {
      statusCode: 200,
      body: JSON.stringify(projectsForUser),
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: "An unknown error occurred",
    };
  }
};

export default handler;
