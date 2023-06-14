import { APIGatewayProxyEvent, APIGatewayProxyHandler } from "aws-lambda";
import { z } from "zod";
import { RunTimeEnvVariable, getEnvVariable } from "../config";
import { ProjectResultService } from "../service/result";
import { DEFAULT_HTTP_HEADERS } from "../utils";

const Event = z.object({
  projectId: z.string(),
});

export const handler: APIGatewayProxyHandler = async (
  incomingEvent: APIGatewayProxyEvent
) => {
  const eventResult = Event.safeParse(incomingEvent.pathParameters);

  if (!eventResult.success) {
    return {
      statusCode: 400,
      headers: DEFAULT_HTTP_HEADERS,
      body: "Invalid request body",
    };
  }

  const resultService = new ProjectResultService(
    getEnvVariable(RunTimeEnvVariable.RESULT_TABLE_NAME)
  );

  const event = eventResult.data;

  try {
    const projectResult = await resultService.getProjectResult({
      projectId: event.projectId,
    });

    if (projectResult.isOk()) {
      return {
        statusCode: 200,
        headers: DEFAULT_HTTP_HEADERS,
        body: JSON.stringify(projectResult.unwrap()),
      };
    }

    return {
      statusCode: 404,
      headers: DEFAULT_HTTP_HEADERS,
      body: "Result not found",
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      headers: DEFAULT_HTTP_HEADERS,
      body: "An unknown error occurred",
    };
  }
};

export default handler;
