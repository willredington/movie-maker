import { Project } from "../models/project";
import { fetcher } from "../utils/api";

export function createProject({
  jwtToken,
  prompt,
}: {
  jwtToken: string;
  prompt: string;
}) {
  return fetcher<Project>({
    jwtToken,
    path: "project",
    requestConfig: {
      method: "POST",
      data: {
        prompt,
      },
    },
  });
}

export function getProjects({
  jwtToken,
  prompt,
}: {
  jwtToken: string;
  prompt: string;
}) {
  return fetcher<Project[]>({
    jwtToken,
    path: "projects",
    requestConfig: {
      method: "GET",
      data: {
        prompt,
      },
    },
  });
}
