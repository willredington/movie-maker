import { withAuthenticationRequired } from "@auth0/auth0-react";
import { Layout } from "../../components/Layout";
import { Prompt } from "../../components/Prompt";

function _Dashboard() {
  return (
    <Layout>
      <Prompt />
    </Layout>
  );
}

export const Dashboard = withAuthenticationRequired(_Dashboard);
