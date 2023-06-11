import { z } from "zod";

export const ProjectResult = z.object({
  userId: z.string(),
  createdAt: z.string(),
  projectId: z.string(),
  videoBucketUrl: z.string(),
});

export type ProjectResult = z.infer<typeof ProjectResult>;
