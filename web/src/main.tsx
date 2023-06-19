import { Auth0Provider } from "@auth0/auth0-react";
import { ChakraProvider } from "@chakra-ui/react";
import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "react-query";
import theme from "./theme";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Auth0Provider
      domain={import.meta.env.VITE_AUTH0_DOMAIN}
      clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
      cacheLocation="localstorage"
      useRefreshTokens={true}
      useRefreshTokensFallback={false}
      authorizationParams={{
        audience: import.meta.env.VITE_AUTH0_AUDIENCE,
        redirect_uri: window.location.origin,
      }}
    >
      <QueryClientProvider client={queryClient}>
        <ChakraProvider theme={theme}>
          <RouterProvider router={router} />
        </ChakraProvider>
      </QueryClientProvider>
    </Auth0Provider>
  </React.StrictMode>
);
