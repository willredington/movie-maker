import { Project } from "../models/project";
import { FetcherProps, fetcher } from "../utils/api";

export function createProject({
  getJwtToken,
  topic,
}: Pick<FetcherProps, "getJwtToken"> & {
  topic: string;
}) {
  return fetcher<Project>({
    getJwtToken,
    path: "project",
    requestConfig: {
      method: "POST",
      data: {
        topic,
      },
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
