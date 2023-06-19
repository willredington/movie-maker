import { withAuthenticationRequired } from "@auth0/auth0-react";
import { Layout } from "../components/Layout/layout";
import { ProjectGrid } from "../components/ProjectGrid/project-grid";

function _Projects() {
  return (
    <Layout>
      <ProjectGrid />
    </Layout>
  );
}

export const Projects = withAuthenticationRequired(_Projects);
