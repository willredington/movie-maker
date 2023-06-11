import { Handler } from "aws-lambda";
import { z } from "zod";
import { RunTimeEnvVariable, getEnvVariable } from "../config";
import { ProjectResultService } from "../service/result";

const Event = z.object({
  projectId: z.string(),
  videoBucketUrl: z.string(),
});

export const handler: Handler = async (incomingEvent) => {
  console.log(incomingEvent);

  const event = Event.parse(incomingEvent);

  const resultService = new ProjectResultService(
    getEnvVariable(RunTimeEnvVariable.RESULT_TABLE_NAME)
  );

  await resultService.createProjectResult({
    projectId: event.projectId,
    videoBucketUrl: event.videoBucketUrl,
    userId: "user-1",
  });
};

export default handler;
