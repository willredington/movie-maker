import { Button, HStack, Input } from "@chakra-ui/react";
import { useState } from "react";
import { useMutation } from "react-query";
import { createProject } from "../../services/project";
import { useAuth0 } from "@auth0/auth0-react";

export const PromptInput = () => {
  const [topic, setTopic] = useState("");

  const { getAccessTokenSilently } = useAuth0();

  const createProjectMutation = useMutation({
    mutationFn: () =>
      createProject({
        getJwtToken: getAccessTokenSilently,
        topic,
      }),
  });

  return (
    <HStack spacing={4}>
      <Input
        type="text"
        value={topic}
        variant={"flushed"}
        borderBottomColor="#c038f8"
        focusBorderColor="#c038f8"
        onChange={(e) => setTopic(e.currentTarget.value)}
        placeholder="Enter a prompt to generate a video (E.g. explain linear regression in statistics to me like I'm 5)"
      />
      <Button
        bgColor={"#c038f8"}
        onClick={() => createProjectMutation.mutate()}
        isLoading={createProjectMutation.isLoading}
        isDisabled={!topic}
      >
        Generate
      </Button>
    </HStack>
  );
};
