import { EditIcon } from "@chakra-ui/icons";
import {
  Card,
  CardBody,
  CardHeader,
  IconButton,
  SimpleGrid,
  Text,
} from "@chakra-ui/react";
import { sortBy } from "lodash";
import { useMemo } from "react";
import { ProjectSection } from "../../models/section";

export function SectionList({ sections }: { sections: ProjectSection[] }) {
  const orderedSections = useMemo(() => sortBy(sections, "order"), [sections]);

  return (
    <SimpleGrid columns={4} spacing={2} mb={4}>
      {orderedSections.map((section) => (
        <Card>
          <CardHeader pos={"relative"}>
            <Text fontWeight={"semibold"} fontSize={"lg"}>
              Section #{section.order + 1}
            </Text>
            <IconButton
              pos={"absolute"}
              top={2}
              right={2}
              colorScheme="blue"
              variant={"ghost"}
              aria-label="edit-button"
              icon={<EditIcon />}
            />
          </CardHeader>
          <CardBody>
            <Text noOfLines={2}>{section.text}</Text>
          </CardBody>
        </Card>
      ))}
    </SimpleGrid>
  );
}
