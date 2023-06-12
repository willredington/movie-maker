import { Button, HStack, Input } from "@chakra-ui/react";
import { useState } from "react";
import { useMutation } from "react-query";
import { createProject } from "../services/project";
import { useAuth0 } from "@auth0/auth0-react";

export const Prompt = () => {
  const [prompt, setPrompt] = useState("");

  // console.log(session.data?.jwtToken);

  // const getProjectsQuery = useQuery(
  //   "getProjects",
  //   () =>
  //     session.data?.user.id
  //       ? getProjects({
  //           jwtToken: session.data?.jwtToken ?? "",
  //           prompt,
  //         })
  //       : null,
  //   {
  //     enabled: !!session.data?.jwtToken,
  //   }
  // );

  // console.log(getProjectsQuery);

  const createProjectMutation = useMutation({
    mutationFn: () =>
      createProject({
        jwtToken: "TODO",
        prompt,
      }),
  });

  // console.log(createProjectMutation.error);
  // console.log(createProjectMutation.data);
  // console.log(createProjectMutation.status);

  return (
    <HStack spacing={4}>
      <Input
        type="text"
        value={prompt}
        variant={"flushed"}
        borderBottomColor="#c038f8"
        focusBorderColor="#c038f8"
        onChange={(e) => setPrompt(e.currentTarget.value)}
        placeholder="Enter a prompt to generate a video (E.g. explain linear regression in statistics to me like I'm 5)"
      />
      <Button
        bgColor={"#c038f8"}
        onClick={() => createProjectMutation.mutate()}
        isLoading={createProjectMutation.isLoading}
        isDisabled={!prompt}
      >
        Generate
      </Button>
    </HStack>
  );
};
