import { z } from "zod";

export const ProjectSection = z.object({
  id: z.string(),
  projectId: z.string(),
  order: z.number(),
  text: z.string(),
  gifHint: z.string(),
  createdAt: z.string(),
  gifFilePath: z.string().optional(),
  audioFilePath: z.string().optional(),
});

export type ProjectSection = z.infer<typeof ProjectSection>;

export type ProjectSectionKey = {
  id: string;
  projectId: string;
};
