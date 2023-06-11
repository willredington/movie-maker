import { useState } from "react";
import styles from "./Prompt.module.css";
import { useMutation } from "@tanstack/react-query";
import { createProject } from "~/service/project";
import ScaleLoader from "react-spinners/ScaleLoader";

export const Prompt = () => {
  const [prompt, setPrompt] = useState("");

  const createProjectMutation = useMutation({
    mutationFn: () =>
      createProject({
        jwtToken: "TODO",
        prompt,
      }),
  });

  console.log(createProjectMutation.error);
  console.log(createProjectMutation.data);
  console.log(createProjectMutation.status);

  return (
    <div className={styles.root}>
      <input
        type="text"
        value={prompt}
        placeholder="Enter a prompt to generate a video"
        className={styles.textField}
        onChange={(e) => setPrompt(e.currentTarget.value)}
      />
      <button
        disabled={!prompt}
        className={styles.button}
        onClick={() => createProjectMutation.mutate()}
      >
        Generate
        <ScaleLoader
          color="white"
          height={20}
          loading={createProjectMutation.isLoading}
        />
      </button>
    </div>
  );
};
