import { Project, ProjectStatus } from "../model";
import { DbClient } from "./db";
import { v4 } from "uuid";

export class ProjectService {
  private readonly client: DbClient<Project>;

  constructor(projectTableName: string) {
    this.client = new DbClient<Project>(Project, projectTableName);
  }

  createProject({ userId, topic }: { userId: string; topic: string }) {
    return this.client.putItem({
      id: v4(),
      userId,
      topic,
      status: ProjectStatus.InProgress,
      createdAt: new Date().toISOString(),
    });
  }

  updateProject({
    key,
    status,
  }: {
    key: {
      id: string;
      userId: string;
    };
    status: ProjectStatus;
  }) {
    return this.client.updateItem(key, {
      status,
    });
  }

  getProject({ userId, id }: { userId: string; id: string }) {
    return this.client.getItem({
      userId,
      id,
    });
  }

  getProjectsForUser({ userId }: { userId: string }) {
    return this.client.getItems({
      KeyConditionExpression: "#userKey = :userKeyValue",
      ExpressionAttributeNames: { "#userKey": "userId" },
      ExpressionAttributeValues: { ":userKeyValue": userId },
    });
  }
}
