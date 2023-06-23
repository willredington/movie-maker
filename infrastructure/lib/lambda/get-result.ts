import { APIGatewayProxyEvent, APIGatewayProxyHandler } from "aws-lambda";
import { z } from "zod";
import * as AWS from "aws-sdk";
import { RunTimeEnvVariable, getEnvVariable } from "../config";
import { ProjectResultService } from "../service/result";
import { DEFAULT_JSON_HTTP_HEADERS, DEFAULT_TEXT_HTTP_HEADERS } from "../utils";
import { ProjectResult } from "../model";
import { createPresignedUrl } from "../service/s3";

const ExpectedParameters = z.object({
  projectId: z.string(),
});

type Result = {
  projectResult: ProjectResult;
  presignedUrl: string;
};

export const handler: APIGatewayProxyHandler = async (
  incomingEvent: APIGatewayProxyEvent
) => {
  const parametersResult = ExpectedParameters.safeParse(
    incomingEvent.pathParameters
  );

  if (!parametersResult.success) {
    return {
      statusCode: 400,
      headers: DEFAULT_TEXT_HTTP_HEADERS,
      body: "Invalid request parameters",
    };
  }

  const resultService = new ProjectResultService(
    getEnvVariable(RunTimeEnvVariable.RESULT_TABLE_NAME)
  );

  const parameters = parametersResult.data;

  try {
    const projectResultWrapped = await resultService.getProjectResult({
      projectId: parameters.projectId,
    });

    if (projectResultWrapped.isOk()) {
      const projectResult = projectResultWrapped.unwrap();

      const presignedUrl = await createPresignedUrl({
        projectId: parameters.projectId,
      });

      const result: Result = {
        projectResult,
        presignedUrl,
      };

      return {
        statusCode: 200,
        headers: DEFAULT_JSON_HTTP_HEADERS,
        body: JSON.stringify(result),
      };
    }

    return {
      statusCode: 404,
      headers: DEFAULT_TEXT_HTTP_HEADERS,
      body: "Result not found",
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
