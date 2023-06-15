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
  let jwtToken: string | null = null;

  try {
    jwtToken = await getJwtToken();
  } catch (err) {
    console.error("error getting the access token");
    throw err;
  }

  const result = await axios<T>({
    ...requestConfig,
    url: `${import.meta.env.VITE_API_ROOT}/${path}`,
    headers: {
      Authorization: `Bearer ${jwtToken}`,
    },
  });

  return result.data;
}
