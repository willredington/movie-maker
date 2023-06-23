import { ProjectSection } from "../models/section";
import { FetcherProps, fetcher } from "../utils/api";

export function updateSection({
  getJwtToken,
  projectId,
  sectionId,
  text,
}: Pick<FetcherProps, "getJwtToken"> & {
  projectId: string;
  sectionId: string;
  text: string;
}) {
  return fetcher<ProjectSection>({
    getJwtToken,
    path: "section",
    requestConfig: {
      method: "PUT",
      data: {
        projectId,
        sectionId,
        text,
      },
    },
  });
}
