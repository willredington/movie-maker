import { useAuth0 } from "@auth0/auth0-react";
import { AddIcon, RepeatIcon } from "@chakra-ui/icons";
import {
  HStack,
  Heading,
  IconButton,
  SimpleGrid,
  Text,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { useQuery } from "react-query";
import { getProjects } from "../../services/project";
import { NewProjectModal } from "./NewProjectModal";
import { ProjectListItem } from "./ProjectListItem";

export function ProjectList() {
  const { getAccessTokenSilently } = useAuth0();

  const { onOpen, isOpen, onClose } = useDisclosure();

  const {
    isFetched,
    refetch,
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

  return (
    <>
      <VStack
        shadow={"xl"}
        align={"flex-start"}
        spacing={4}
        py={6}
        px={4}
        w="full"
      >
        <HStack justify={"space-between"} w={"full"}>
          <HStack spacing={4}>
            <Heading textAlign={"left"} size={"lg"}>
              My Projects
            </Heading>
            <IconButton
              onClick={onOpen}
              icon={<AddIcon />}
              aria-label="add project"
            />
          </HStack>
          <IconButton
            icon={<RepeatIcon />}
            aria-label="refresh-btn"
            onClick={() => void refetch()}
          />
        </HStack>
        <SimpleGrid w="full" columns={3} spacing={4}>
          {projects.length === 0 && isFetched && (
            <Text fontSize={"lg"}>
              Projects will appear here, nothing yet...
            </Text>
          )}
          {projects.map((project) => (
            <ProjectListItem key={project.id} project={project} />
          ))}
        </SimpleGrid>
      </VStack>
      <NewProjectModal isOpen={isOpen} onClose={onClose} />
    </>
  );
}
