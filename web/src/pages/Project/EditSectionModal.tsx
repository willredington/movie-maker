import { useAuth0 } from "@auth0/auth0-react";
import {
  Button,
  FormControl,
  FormLabel,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { useCallback, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { ProjectSection } from "../../models/section";
import { updateSection } from "../../services/section";

export const EditSectionModal = ({
  isOpen,
  onClose,
  section,
}: {
  isOpen: boolean;
  onClose: () => void;
  section: ProjectSection;
}) => {
  const toast = useToast();

  const [text, setText] = useState(section.text);

  const { getAccessTokenSilently } = useAuth0();

  const queryClient = useQueryClient();

  const updateSectionMutation = useMutation({
    mutationFn: updateSection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getProject"] });
      onClose();
    },
    onError: (err) => {
      console.error(err);
      toast({
        title: "Failed to update section",
        description: "Something went wrong, please try again in a few minutes",
        status: "error",
        isClosable: true,
      });
    },
  });

  const handleUpdate = useCallback(async () => {
    if (text) {
      await updateSectionMutation.mutateAsync({
        getJwtToken: getAccessTokenSilently,
        sectionId: section.id,
        projectId: section.projectId,
        text,
      });
    }
  }, [section, text, getAccessTokenSilently, updateSectionMutation]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={"xl"}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit Section #{section.order + 1}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <FormLabel>Text</FormLabel>
            <Textarea
              value={text}
              onChange={(e) => setText(e.currentTarget.value)}
              placeholder="Explain the basics of linear regression..."
            />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="green"
            isLoading={updateSectionMutation.isLoading}
            onClick={handleUpdate}
          >
            Update
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
