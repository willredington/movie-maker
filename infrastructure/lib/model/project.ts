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
  userId: z.string(),
  topic: z.string(),
  status: z.nativeEnum(ProjectStatus),
  createdAt: z.string(),
});

export type Project = z.infer<typeof Project>;
