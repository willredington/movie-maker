import { createBrowserRouter } from "react-router-dom";
import { Projects } from "./pages/Projects";
import { Project } from "./pages/Project/Project";

export const router = createBrowserRouter([
  {
    path: "/projects",
    Component: Projects,
  },
  {
    path: "/project/:projectId",
    Component: Project,
  },
]);
