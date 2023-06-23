import { useAuth0 } from "@auth0/auth0-react";
import { DownloadIcon } from "@chakra-ui/icons";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Heading,
  IconButton,
  Link,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useCallback } from "react";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { StatusTag } from "../../components/StatusTag";
import { Project, ProjectStatus } from "../../models/project";
import { getResult } from "../../services/result";

export function ProjectListItem({ project }: Record<"project", Project>) {
  const navigate = useNavigate();

  const { getAccessTokenSilently } = useAuth0();

  const isComplete = project.status === ProjectStatus.Completed;

  const needsApproval = project.status === ProjectStatus.NeedsApproval;

  const { data: projectResult } = useQuery(
    "getResult",
    () =>
      getResult({
        getJwtToken: getAccessTokenSilently,
        projectId: project.id,
      }),
    {
      enabled: isComplete,
    }
  );

  const handleReview = useCallback(() => {
    navigate(`/project/${project.id}`);
  }, [navigate, project.id]);

  return (
    <Card size={"sm"}>
      <CardHeader pos={"relative"}>
        <VStack spacing={3} align={"flex-start"}>
          <Heading size={"md"}>{project.title}</Heading>
          <StatusTag status={project.status} />
        </VStack>
        {projectResult?.presignedUrl != null && (
          <IconButton
            pos={"absolute"}
            top={2}
            right={2}
            as={Link}
            icon={<DownloadIcon />}
            aria-label="foo"
            variant={"ghost"}
            target="_blank"
            colorScheme="blue"
            href={projectResult.presignedUrl}
            download
          />
        )}
      </CardHeader>
      <CardBody>
        <Text noOfLines={2}>{project.topic}</Text>
      </CardBody>
      <CardFooter>
        {needsApproval && (
          <Button colorScheme="blue" variant={"ghost"} onClick={handleReview}>
            Review
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
