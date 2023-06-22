import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Heading,
  Tag,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Project, ProjectStatus } from "../../models/project";

export function ProjectListItem({ project }: Record<"project", Project>) {
  const navigate = useNavigate();

  const needsApproval = useMemo(
    () => project.status === ProjectStatus.NeedsApproval,
    [project.status]
  );

  const handleReview = useCallback(() => {
    navigate(`/project/${project.id}`);
  }, [navigate, project.id]);

  return (
    <Card size={"sm"}>
      <CardHeader>
        <VStack spacing={3} align={"flex-start"}>
          <Heading size={"md"}>{project.title}</Heading>
          {needsApproval && <Tag colorScheme="yellow">Needs Approval</Tag>}
        </VStack>
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
