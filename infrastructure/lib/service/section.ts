import { v4 } from "uuid";
import { ProjectSection, ProjectSectionKey } from "../model";
import { DbClient } from "./db";

export class SectionService {
  private readonly client: DbClient<ProjectSection>;

  constructor(sectionTableName: string) {
    this.client = new DbClient<ProjectSection>(
      ProjectSection,
      sectionTableName
    );
  }

  createSection({
    text,
    order,
    gifHint,
    projectId,
  }: {
    text: string;
    order: number;
    gifHint: string;
    projectId: string;
  }) {
    return this.client.putItem({
      id: v4(),
      text,
      order,
      gifHint,
      projectId,
      createdAt: new Date().toISOString(),
    });
  }

  updateSection({
    key,
    updateProps,
  }: {
    key: ProjectSectionKey;
    updateProps: Partial<Pick<ProjectSection, "gifFilePath" | "audioFilePath">>;
  }) {
    return this.client.updateItem(key, updateProps);
  }

  getSectionsForProject({ projectId }: { projectId: string }) {
    return this.client.getItems({
      KeyConditionExpression: "#projectKey = :projectKeyValue",
      ExpressionAttributeNames: { "#projectKey": "projectId" },
      ExpressionAttributeValues: { ":projectKeyValue": projectId },
    });
  }
}
