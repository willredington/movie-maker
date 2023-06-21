import { useAuth0 } from "@auth0/auth0-react";
import {
  Button,
  FormControl,
  FormLabel,
  HStack,
  Input,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { useMutation } from "react-query";
import { createProject } from "../../services/project";
import { useNavigate } from "react-router-dom";

export const Prompt = () => {
  const toast = useToast();

  const navigate = useNavigate();

  const [topic, setTopic] = useState("");

  const { getAccessTokenSilently } = useAuth0();

  const createProjectMutation = useMutation({
    mutationFn: () =>
      createProject({
        getJwtToken: getAccessTokenSilently,
        topic,
      }),
    onSuccess: () => {
      toast({
        title: "Movie generation succeeded",
        status: "success",
        isClosable: true,
      });
      navigate("/projects");
    },
    onError: (err) => {
      console.error(err);
      toast({
        title: "Movie generation failed",
        description: "Something went wrong, please try again in a few minutes",
        status: "error",
        isClosable: true,
      });
    },
  });

  return (
    <FormControl isRequired>
      <FormLabel fontSize={"xl"}>Prompt</FormLabel>
      <HStack w={"full"} alignItems={"center"}>
        <Input
          placeholder="Explain the basics of linear regression..."
          value={topic}
          size={"lg"}
          onChange={(e) => setTopic(e.currentTarget.value)}
        />
        <Button
          size={"lg"}
          isDisabled={!topic}
          colorScheme="green"
          isLoading={createProjectMutation.isLoading}
          onClick={() => createProjectMutation.mutate()}
        >
          Generate
        </Button>
      </HStack>
    </FormControl>
  );
};
