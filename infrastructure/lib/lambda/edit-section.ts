import { APIGatewayProxyHandler } from "aws-lambda";
import { z } from "zod";
import { RunTimeEnvVariable, getEnvVariable } from "../config";
import { getAuthFromEvent } from "../service/auth";
import { SectionService } from "../service/section";
import { DEFAULT_JSON_HTTP_HEADERS, DEFAULT_TEXT_HTTP_HEADERS } from "../utils";

const ExpectedRequestBody = z.object({
  projectId: z.string(),
  sectionId: z.string(),
  text: z.string(),
  // gifUrl: z.string().optional()
});

export const handler: APIGatewayProxyHandler = async (proxyEvent) => {
  // TODO: does user have permission to edit this entity?
  const { userId } = getAuthFromEvent(proxyEvent);

  const requestBodyResult = ExpectedRequestBody.safeParse(
    JSON.parse(proxyEvent.body ?? "")
  );

  if (!requestBodyResult.success) {
    return {
      statusCode: 400,
      headers: DEFAULT_TEXT_HTTP_HEADERS,
      body: "Invalid request body",
    };
  }

  const sectionService = new SectionService(
    getEnvVariable(RunTimeEnvVariable.SECTION_TABLE_NAME)
  );

  try {
    const { projectId, sectionId, ...updateProps } = requestBodyResult.data;

    const updatedSectionResult = await sectionService.updateSection({
      key: {
        id: sectionId,
        projectId,
      },
      updateProps,
    });

    return {
      statusCode: 200,
      headers: DEFAULT_JSON_HTTP_HEADERS,
      body: JSON.stringify(updatedSectionResult.unwrap()),
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
