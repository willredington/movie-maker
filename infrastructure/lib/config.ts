import { z } from "zod";

export const ProjectConfig = z.object({
  env: z.enum(["dev", "prod"]),
  branchName: z.string(),
  projectName: z.string(),
});

export type ProjectConfig = z.infer<typeof ProjectConfig>;

export enum BuildTimeEnvVariable {
  ENV = "ENV",
  BRANCH_NAME = "BRANCH_NAME",
  PROJECT_NAME = "PROJECT_NAME",
}

export enum RunTimeEnvVariable {
  PROJECT_TABLE_NAME = "PROJECT_TABLE_NAME",
  SECTION_TABLE_NAME = "SECTION_TABLE_NAME",
  RESULT_TABLE_NAME = "RESULT_TABLE_NAME",
  AUDIO_BUCKET_NAME = "AUDIO_BUCKET_NAME",
  VIDEO_BUCKET_NAME = "VIDEO_BUCKET_NAME",
  GIF_BUCKET_NAME = "GIF_BUCKET_NAME",
  START_PROJECT_STATE_MACHINE_ARN = "START_PROJECT_STATE_MACHINE_ARN",
  FINALIZE_PROJECT_STATE_MACHINE_ARN = "FINALIZE_PROJECT_STATE_MACHINE_ARN",
}

export function getEnvVariable(
  envVar: BuildTimeEnvVariable | RunTimeEnvVariable
) {
  try {
    return z.string().parse(process.env[envVar]);
  } catch (err) {
    console.error(`could not find environment variable: ${envVar}`);
    throw err;
  }
}

export function getProjectConfig() {
  return ProjectConfig.parse({
    env: getEnvVariable(BuildTimeEnvVariable.ENV),
    branchName: getEnvVariable(BuildTimeEnvVariable.BRANCH_NAME),
    projectName: getEnvVariable(BuildTimeEnvVariable.PROJECT_NAME),
  });
}

export const EVENT_SOURCE = "app.events";
