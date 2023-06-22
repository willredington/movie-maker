import { createBrowserRouter } from "react-router-dom";
import { Home } from "./pages/Home/home";
import { Projects } from "./pages/Projects";
import { Project } from "./pages/Project/Project";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Home,
  },
  {
    path: "/projects",
    Component: Projects,
  },
  {
    path: "/project/:projectId",
    Component: Project,
  },
]);
