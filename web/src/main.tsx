import { Auth0Provider } from "@auth0/auth0-react";
import { ChakraProvider } from "@chakra-ui/react";
import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "react-query";
import { App } from "./app";
import theme from "./theme";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Auth0Provider
      domain={import.meta.env.VITE_AUTH0_DOMAIN}
      clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
      cacheLocation="memory"
      useRefreshTokens={true}
      useRefreshTokensFallback={false}
      authorizationParams={{
        audience: "https://vzqsui1hp6.execute-api.us-east-1.amazonaws.com/prod",
        redirect_uri: window.location.origin,
      }}
    >
      <QueryClientProvider client={queryClient}>
        <ChakraProvider theme={theme}>
          <App />
        </ChakraProvider>
      </QueryClientProvider>
    </Auth0Provider>
  </React.StrictMode>
);
