export enum ProjectStatus {
  InProgress = "InProgress",
  NeedsApproval = "NeedsApproval",
  Finalizing = "Finalizing",
  Failed = "Failed",
  Completed = "Completed",
}

export type Project = {
  id: string;
  title: string;
  userId: string;
  topic: string;
  status: ProjectStatus;
  createdAt: string;
};
