import { useAuth0 } from "@auth0/auth0-react";
import { HStack, SimpleGrid, Text, VStack } from "@chakra-ui/react";
import { useQuery } from "react-query";
import { getProjects } from "../../services/project";
import { ProjectGridItem } from "./ProjectGridItem";

export function ProjectGrid() {
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

  return (
    <VStack align={"flex-start"} alignSelf={"stretch"} spacing={4}>
      <HStack>
        <Text>Projects</Text>
      </HStack>
      <SimpleGrid columns={2} spacing={4} w="full">
        {projects.map((project) => (
          <ProjectGridItem key={project.id} project={project} />
        ))}
      </SimpleGrid>
    </VStack>
  );
}