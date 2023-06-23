import { Project } from "../models/project";
import { ProjectSection } from "../models/section";
import { FetcherProps, fetcher } from "../utils/api";

export function createProject({
  getJwtToken,
  topic,
  title,
}: Pick<FetcherProps, "getJwtToken"> & {
  topic: string;
  title: string;
}) {
  return fetcher<Project>({
    getJwtToken,
    path: "project",
    requestConfig: {
      method: "POST",
      data: {
        topic,
        title,
      },
    },
  });
}

export function submitProject({
  getJwtToken,
  projectId,
}: Pick<FetcherProps, "getJwtToken"> & {
  projectId: string;
}) {
  return fetcher<Project>({
    getJwtToken,
    path: `project/${projectId}`,
    requestConfig: {
      method: "PUT",
    },
  });
}

export function getProject({
  projectId,
  getJwtToken,
}: Pick<FetcherProps, "getJwtToken"> & {
  projectId: string;
}) {
  return fetcher<{
    project: Project;
    sections: ProjectSection[];
  }>({
    getJwtToken,
    path: `project/${projectId}`,
    requestConfig: {
      method: "GET",
    },
  });
}

export function getProjects({
  getJwtToken,
}: Pick<FetcherProps, "getJwtToken">) {
  return fetcher<Project[]>({
    getJwtToken,
    path: "projects",
    requestConfig: {
      method: "GET",
    },
  });
}
