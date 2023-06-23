import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import {
  Button,
  Heading,
  Skeleton,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { useMutation, useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { Layout } from "../../components/Layout";
import { StatusTag } from "../../components/StatusTag";
import { getProject, submitProject } from "../../services/project";
import { SectionList } from "./SectionList";
import { useCallback } from "react";

type PageParams = {
  projectId: string;
};

function _Project() {
  const { projectId } = useParams<PageParams>();

  const toast = useToast();

  const navigate = useNavigate();

  const { getAccessTokenSilently } = useAuth0();

  const submitProjectMutation = useMutation("submitProject", {
    mutationFn: submitProject,
    onSuccess: () => {
      navigate("/projects");
    },
    onError: (err) => {
      console.error(err);
      toast({
        title: "Failed to create movie",
        description: "Something went wrong, please try again in a few minutes",
        status: "error",
        isClosable: true,
      });
    },
  });

  const handleApprove = useCallback(async () => {
    if (projectId) {
      await submitProjectMutation.mutateAsync({
        getJwtToken: getAccessTokenSilently,
        projectId,
      });
    }
  }, [projectId, getAccessTokenSilently, submitProjectMutation]);

  const { data: projectData } = useQuery(
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

  return (
    <Layout>
      {projectData && (
        <VStack w={"full"} spacing={4}>
          <Heading>{projectData.project.title}</Heading>
          <StatusTag status={projectData.project.status} />
          <Text noOfLines={2} fontSize={"2xl"}>
            {projectData.project.topic}
          </Text>
          <Button
            colorScheme="blue"
            alignSelf={"flex-start"}
            onClick={handleApprove}
            isLoading={submitProjectMutation.isLoading}
          >
            Approve
          </Button>
          <SectionList sections={projectData.sections} />
        </VStack>
      )}
    </Layout>
  );
}

export const Project = withAuthenticationRequired(_Project);
