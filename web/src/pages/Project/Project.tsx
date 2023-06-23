import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import { Heading, Skeleton, Text, VStack } from "@chakra-ui/react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { Layout } from "../../components/Layout";
import { StatusTag } from "../../components/StatusTag";
import { getProject } from "../../services/project";
import { SectionList } from "./SectionList";

type PageParams = {
  projectId: string;
};

function _Project() {
  const { projectId } = useParams<PageParams>();

  const { getAccessTokenSilently } = useAuth0();

  const {
    isError,
    isLoading,
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

  return (
    <Layout>
      {projectData && (
        <VStack w={"full"} spacing={4}>
          <Heading>{projectData.project.title}</Heading>
          <StatusTag status={projectData.project.status} />
          <Text noOfLines={2} fontSize={"2xl"}>
            {projectData.project.topic}
          </Text>
          <SectionList sections={projectData.sections} />
        </VStack>
      )}
    </Layout>
  );
}

export const Project = withAuthenticationRequired(_Project);
