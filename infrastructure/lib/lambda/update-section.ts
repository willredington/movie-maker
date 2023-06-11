import { Handler } from "aws-lambda";
import { z } from "zod";
import { RunTimeEnvVariable, getEnvVariable } from "../config";
import { SectionService } from "../service/section";

const Event = z.object({
  sectionId: z.string(),
  projectId: z.string(),
  gifBucketLocation: z.string(),
  audioBucketLocation: z.string(),
});

export const handler: Handler = async (incomingEvent) => {
  console.log(incomingEvent);

  const event = Event.parse(incomingEvent);

  const sectionService = new SectionService(
    getEnvVariable(RunTimeEnvVariable.SECTION_TABLE_NAME)
  );

  await sectionService.updateSection({
    key: {
      id: event.sectionId,
      projectId: event.projectId,
    },
    updateProps: {
      gifFilePath: event.gifBucketLocation,
      audioFilePath: event.audioBucketLocation,
    },
  });
};

export default handler;
