import { Handler } from "aws-lambda";
import { z } from "zod";
import { RunTimeEnvVariable, getEnvVariable } from "../config";
import { ProjectStatus } from "../model";
import { ProjectService } from "../service/project";

const Event = z.object({
  userId: z.string(),
  projectId: z.string(),
  projectStatus: z.nativeEnum(ProjectStatus),
});

export const handler: Handler = async (incomingEvent) => {
  console.log(incomingEvent);

  const event = Event.parse(incomingEvent);

  const projectService = new ProjectService(
    getEnvVariable(RunTimeEnvVariable.PROJECT_TABLE_NAME)
  );

  await projectService.updateProject({
    key: {
      id: event.projectId,
      userId: event.userId,
    },
    status: event.projectStatus,
  });
};

export default handler;
