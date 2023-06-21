import { useAuth0 } from "@auth0/auth0-react";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useMutation } from "react-query";
import { createProject } from "../../services/project";
import { Button } from "../Button";
import { Input } from "../Input";
import styles from "./prompt-input.module.css";

export const PromptInput = () => {
  const [topic, setTopic] = useState("");

  const { getAccessTokenSilently } = useAuth0();

  const createProjectMutation = useMutation({
    mutationFn: () =>
      createProject({
        getJwtToken: getAccessTokenSilently,
        topic,
      }),
    onSuccess: () => {
      toast("Making your movie, please wait...");
      // navigate("/projects");
    },
    onError: (err) => {
      console.error(err);
      toast("Something went wrong, try again in a few minutes");
    },
  });

  return (
    <>
      <div className={styles.root}>
        <div className={styles.input}>
          <Input
            value={topic}
            type="text"
            onChange={(e) => setTopic(e.currentTarget.value)}
            placeholder="Enter a prompt to generate a video"
          />
        </div>
        <Button
          onClick={() => createProjectMutation.mutate()}
          disabled={!topic}
        >
          Generate
        </Button>
      </div>
      <Toaster />
    </>
  );
};
