import { EditIcon } from "@chakra-ui/icons";
import {
  Card,
  CardBody,
  CardHeader,
  IconButton,
  SimpleGrid,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { sortBy } from "lodash";
import { useCallback, useMemo, useState } from "react";
import { ProjectSection } from "../../models/section";
import { EditSectionModal } from "./EditSectionModal";

export function SectionList({ sections }: { sections: ProjectSection[] }) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const orderedSections = useMemo(() => sortBy(sections, "order"), [sections]);

  const [selectedSection, setSelectedSection] = useState<ProjectSection | null>(
    null
  );

  const handleEdit = useCallback(
    (section: ProjectSection) => {
      setSelectedSection(section);
      onOpen();
    },
    [onOpen]
  );

  return (
    <>
      <SimpleGrid columns={4} spacing={2} mb={4}>
        {orderedSections.map((section) => (
          <Card key={section.id}>
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
                onClick={() => handleEdit(section)}
              />
            </CardHeader>
            <CardBody>
              <Text noOfLines={2}>{section.text}</Text>
            </CardBody>
          </Card>
        ))}
      </SimpleGrid>
      {selectedSection && (
        <EditSectionModal
          isOpen={isOpen}
          onClose={onClose}
          section={selectedSection}
        />
      )}
    </>
  );
}
