import { FetcherProps, fetcher } from "../utils/api";

export function getResult({
  projectId,
  getJwtToken,
}: Pick<FetcherProps, "getJwtToken"> & {
  projectId: string;
}) {
  return fetcher<{
    presignedUrl: string;
  }>({
    getJwtToken,
    path: `result/${projectId}`,
    requestConfig: {
      method: "GET",
    },
  });
}
