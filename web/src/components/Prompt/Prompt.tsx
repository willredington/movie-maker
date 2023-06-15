import { useAuth0 } from "@auth0/auth0-react";
import { useQuery } from "react-query";
import { getProjects } from "../../services/project";
import { Card } from "../Card";
import { PromptInput } from "./PromptInput";

export const Prompt = () => {
  const { getAccessTokenSilently } = useAuth0();

  // console.log(session.data?.jwtToken);

  const getProjectsQuery = useQuery("getProjects", () =>
    getProjects({
      getJwtToken: getAccessTokenSilently,
    })
  );

  console.log(getProjectsQuery);

  return (
    <Card>
      <PromptInput />
    </Card>
  );
};
