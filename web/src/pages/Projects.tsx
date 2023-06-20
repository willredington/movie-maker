import { withAuthenticationRequired } from "@auth0/auth0-react";
import { Layout } from "../components/Layout/layout";

function _Projects() {
  return (
    <Layout>
      <p>TODO </p>
    </Layout>
  );
}

export const Projects = withAuthenticationRequired(_Projects);
