import { withAuthenticationRequired } from "@auth0/auth0-react";
import { Layout } from "../components/Layout/layout";
import { Prompt } from "../components/Prompt";

function _Home() {
  return (
    <Layout>
      <Prompt />
    </Layout>
  );
}

export const Home = withAuthenticationRequired(_Home);
