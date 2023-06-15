import axios, { type AxiosRequestConfig } from "axios";
import { Auth0ContextInterface } from "@auth0/auth0-react";

export type FetcherProps = {
  path: string;
  getJwtToken: Auth0ContextInterface["getAccessTokenSilently"];
  requestConfig: Pick<AxiosRequestConfig, "method" | "data">;
};

export async function fetcher<T>({
  path,
  getJwtToken,
  requestConfig,
}: FetcherProps) {
  let jwtToken: string | null = null;

  try {
    jwtToken = await getJwtToken({
      authorizationParams: {
        audience: import.meta.env.VITE_AUTH0_AUDIENCE,
      },
    });
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
