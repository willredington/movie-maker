import { type Project } from "~/model/project";
import { fetcher } from "~/util/api";

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
