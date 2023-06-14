import axios, { type AxiosRequestConfig } from "axios";

export type FetcherProps = {
  path: string;
  getJwtToken: () => Promise<string>;
  requestConfig: Pick<AxiosRequestConfig, "method" | "data">;
};

export async function fetcher<T>({
  path,
  getJwtToken,
  requestConfig,
}: FetcherProps) {
  const jwtToken = await getJwtToken();

  console.log(jwtToken);

  const result = await axios<T>({
    ...requestConfig,
    url: `${import.meta.env.VITE_API_ROOT}/${path}`,
    headers: {
      Authorization: `Bearer ${jwtToken}`,
    },
  });

  return result.data;
}
