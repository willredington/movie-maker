import { useAuth0 } from "@auth0/auth0-react";
import {
  Button,
  FormControl,
  FormLabel,
  HStack,
  Input,
  ListItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  UnorderedList,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { createProject } from "../../services/project";

export const NewProjectModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const toast = useToast();

  const [title, setTitle] = useState("");
  const [topic, setTopic] = useState("");

  const { getAccessTokenSilently } = useAuth0();

  const queryClient = useQueryClient();

  const createProjectMutation = useMutation({
    mutationFn: () =>
      createProject({
        getJwtToken: getAccessTokenSilently,
        topic,
        title,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getProjects"] });
      onClose();
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

  const isValid = !!title && !!topic;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={"xl"}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create New Project</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack align={"flex-start"} spacing={4}>
            <FormControl isRequired>
              <FormLabel>Title</FormLabel>
              <Input
                value={title}
                onChange={(e) => setTitle(e.currentTarget.value)}
                placeholder="Give the movie a title"
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Prompt</FormLabel>
              <Input
                value={topic}
                onChange={(e) => setTopic(e.currentTarget.value)}
                placeholder="Explain the basics of linear regression..."
              />
            </FormControl>
            <Text fontSize={"lg"}>Tips</Text>
            <UnorderedList spacing={2}>
              <ListItem>Keep prompts simple and short</ListItem>
              <ListItem>Ask to explain concepts or subjects</ListItem>
              <ListItem>
                No foul language or inappropriate subject matter
              </ListItem>
            </UnorderedList>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button
            isDisabled={!isValid}
            colorScheme="green"
            isLoading={createProjectMutation.isLoading}
            onClick={() => createProjectMutation.mutate()}
          >
            Generate
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
