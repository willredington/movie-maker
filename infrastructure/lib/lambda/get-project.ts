import { APIGatewayProxyEvent, APIGatewayProxyHandler } from "aws-lambda";
import { z } from "zod";
import { RunTimeEnvVariable, getEnvVariable } from "../config";
import { ProjectResultService } from "../service/result";
import { DEFAULT_JSON_HTTP_HEADERS, DEFAULT_TEXT_HTTP_HEADERS } from "../utils";
import { ProjectService } from "../service/project";
import { getAuthFromEvent } from "../service/auth";
import { SectionService } from "../service/section";

const ExpectedParameters = z.object({
  projectId: z.string(),
});

export const handler: APIGatewayProxyHandler = async (
  incomingEvent: APIGatewayProxyEvent
) => {
  const { userId } = getAuthFromEvent(incomingEvent);

  const parametersResult = ExpectedParameters.safeParse(
    incomingEvent.pathParameters
  );

  if (!parametersResult.success) {
    return {
      statusCode: 400,
      headers: DEFAULT_TEXT_HTTP_HEADERS,
      body: "Invalid request body",
    };
  }

  const projectService = new ProjectService(
    getEnvVariable(RunTimeEnvVariable.PROJECT_TABLE_NAME)
  );

  const sectionService = new SectionService(
    getEnvVariable(RunTimeEnvVariable.SECTION_TABLE_NAME)
  );

  const { projectId } = parametersResult.data;

  try {
    const projectResult = await projectService.getProject({
      id: projectId,
      userId,
    });

    if (projectResult.isErr()) {
      return {
        statusCode: 404,
        headers: DEFAULT_TEXT_HTTP_HEADERS,
        body: "Result not found",
      };
    }

    const sectionResult = await sectionService.getSectionsForProject({
      projectId,
    });

    // TODO: should we verify section result first?

    return {
      statusCode: 200,
      headers: DEFAULT_JSON_HTTP_HEADERS,
      body: JSON.stringify({
        project: projectResult.unwrap(),
        sections: sectionResult.unwrap(),
      }),
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
