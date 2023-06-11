import axios, { type AxiosRequestConfig } from "axios";
import { env } from "~/env.mjs";

export async function fetcher<T>({
  path,
  jwtToken,
  requestConfig,
}: {
  path: string;
  jwtToken: string;
  requestConfig: Pick<AxiosRequestConfig, "method" | "data">;
}) {
  const result = await axios<T>({
    ...requestConfig,
    url: `${env.NEXT_PUBLIC_API_ROOT}/${path}`,
    headers: {
      Authorization: `Bearer ${jwtToken}`,
    },
  });

  return result.data;
}
