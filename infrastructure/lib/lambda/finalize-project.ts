import { APIGatewayProxyHandler } from "aws-lambda";
import { StepFunctions } from "aws-sdk";
import { RunTimeEnvVariable, getEnvVariable } from "../config";
import { z } from "zod";
import { ProjectService } from "../service/project";
import { ProjectSection, ProjectStatus } from "../model";
import { DEFAULT_JSON_HTTP_HEADERS, DEFAULT_TEXT_HTTP_HEADERS } from "../utils";
import { getAuthFromEvent } from "../service/auth";
import { SectionService } from "../service/section";

const stepFunctions = new StepFunctions();

const ExpectedParameters = z.object({
  projectId: z.string().nonempty(),
});

type FinalizeProjectStateMachineInput = {
  userId: string;
  projectId: string;
  sections: ProjectSection[];
};

export const handler: APIGatewayProxyHandler = async (proxyEvent) => {
  console.log(proxyEvent);

  const { userId } = getAuthFromEvent(proxyEvent);

  const parametersResult = ExpectedParameters.safeParse(
    proxyEvent.pathParameters
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

  try {
    const project = (
      await projectService.getProject({
        userId,
        id: parametersResult.data.projectId,
      })
    )
      .mapErr(() => "Could not find project")
      .unwrap();

    if (project.status !== ProjectStatus.NeedsApproval) {
      return {
        statusCode: 409,
        headers: DEFAULT_TEXT_HTTP_HEADERS,
        body: "Project not in a valid state",
      };
    }

    const sectionResult = await sectionService.getSectionsForProject({
      projectId: parametersResult.data.projectId,
    });

    await stepFunctions
      .startExecution({
        input: JSON.stringify({
          userId,
          sections: sectionResult.unwrap(),
          projectId: parametersResult.data.projectId,
        } satisfies FinalizeProjectStateMachineInput),
        stateMachineArn: getEnvVariable(
          RunTimeEnvVariable.FINALIZE_PROJECT_STATE_MACHINE_ARN
        ),
      })
      .promise();

    return {
      statusCode: 201,
      headers: DEFAULT_TEXT_HTTP_HEADERS,
      body: "Created",
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
