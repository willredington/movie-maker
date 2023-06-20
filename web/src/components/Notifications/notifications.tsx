import { useAuth0 } from "@auth0/auth0-react";
import { useQuery } from "react-query";
import { getProjects } from "../../services/project";
import styles from "./projects.module.css";

export function Notifications() {
  const { getAccessTokenSilently } = useAuth0();

  const { isLoading, data: projects = [] } = useQuery(
    "getProjects",
    () =>
      getProjects({
        getJwtToken: getAccessTokenSilently,
      }),
    {
      // refetchInterval: 3000,
    }
  );

  console.log("projects", projects);

  return <div className={styles.root}>foo</div>;
}
