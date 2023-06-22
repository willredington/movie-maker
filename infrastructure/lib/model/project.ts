import { z } from "zod";

export enum ProjectStatus {
  InProgress = "InProgress",
  NeedsApproval = "NeedsApproval",
  Finalizing = "Finalizing",
  Failed = "Failed",
  Completed = "Completed",
}

export const Project = z.object({
  id: z.string(),
  title: z.string(),
  userId: z.string(),
  topic: z.string(),
  createdAt: z.string(),
  status: z.nativeEnum(ProjectStatus),
});

export type Project = z.infer<typeof Project>;
