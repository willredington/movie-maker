import { createBrowserRouter } from "react-router-dom";
import { Home } from "./pages/Home/home";
import { Dashboard } from "./pages/Dashboard/dashboard";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Home,
  },
  {
    path: "/dashboard",
    Component: Dashboard,
  },
]);
