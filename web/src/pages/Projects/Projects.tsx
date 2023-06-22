import { withAuthenticationRequired } from "@auth0/auth0-react";
import { Layout } from "../../components/Layout";
import { ProjectList } from "./ProjectList";

function _Projects() {
  return (
    <Layout>
      <ProjectList />
    </Layout>
  );
}

export const Projects = withAuthenticationRequired(_Projects);
