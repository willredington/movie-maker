import { createBrowserRouter } from "react-router-dom";
import { Home } from "./pages/Home";
import { Projects } from "./pages/Projects";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Home,
  },
  {
    path: "/projects",
    Component: Projects,
  },
]);
