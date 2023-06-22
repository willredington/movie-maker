import { useAuth0 } from "@auth0/auth0-react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { getProject } from "../../services/project";

type PageParams = {
  projectId: string;
};

export function Project() {
  const { projectId } = useParams<PageParams>();

  const { getAccessTokenSilently } = useAuth0();

  const {
    isLoading,
    isError,
    data: projectData,
  } = useQuery(
    "getProject",
    () =>
      projectId != null
        ? getProject({
            getJwtToken: getAccessTokenSilently,
            projectId,
          })
        : null,
    {
      enabled: !!projectId,
    }
  );

  console.log(projectData);

  return <p>project goes here</p>;
}
