import { Card, CardBody, Text } from "@chakra-ui/react";
import { Project } from "../../models/project";

export function ProjectGridItem({ project }: { project: Project }) {
  return (
    <Card
      p={4}
      bg="rgba(118, 0, 192, 0.2)"
      boxShadow={"0 4px 30px rgba(0, 0, 0, 0.1)"}
      color="white"
      rounded={"md"}
      px={8}
      py={6}
    >
      <CardBody>
        <Text noOfLines={2}>{project.topic}</Text>
      </CardBody>
    </Card>
  );
}
