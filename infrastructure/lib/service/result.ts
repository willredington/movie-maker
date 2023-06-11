import { ProjectResult } from "../model";
import { DbClient } from "./db";

export class ProjectResultService {
  private readonly client: DbClient<ProjectResult>;

  constructor(projectResultTableName: string) {
    this.client = new DbClient<ProjectResult>(
      ProjectResult,
      projectResultTableName
    );
  }

  createProjectResult({
    projectId,
    userId,
    videoBucketUrl,
  }: {
    projectId: string;
    userId: string;
    videoBucketUrl: string;
  }) {
    return this.client.putItem({
      userId,
      projectId,
      videoBucketUrl,
      createdAt: new Date().toISOString(),
    });
  }

  getProjectResult({ projectId }: { projectId: string }) {
    return this.client.getItem({
      projectId,
    });
  }
}
