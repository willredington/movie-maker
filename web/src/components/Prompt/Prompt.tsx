import { useAuth0 } from "@auth0/auth0-react";
import { useQuery } from "react-query";
import { getProjects } from "../../services/project";
import { Card } from "../Card";
import { PromptInput } from "./PromptInput";
import { useMemo } from "react";
import { ProjectStatus } from "../../models/project";

export const Prompt = () => {
  const { getAccessTokenSilently } = useAuth0();

  const {
    isLoading,
    isFetched,
    data: projects = [],
  } = useQuery(
    "getProjects",
    () =>
      getProjects({
        getJwtToken: getAccessTokenSilently,
      }),
    {
      refetchInterval: 5000,
    }
  );

  const hasActiveProjects = useMemo(() =>
    projects.some((project) => [ProjectStatus.Failed, ProjectStatus.Completed])
  );

  return (
    <Card>
      <PromptInput />
    </Card>
  );
};
