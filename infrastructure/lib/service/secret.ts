import * as AWS from "aws-sdk";
import { z } from "zod";
import { ProjectConfig } from "../config";

export enum SecretName {
  OPENAI_API_KEY = "OPENAI_API_KEY",
  AUTH0_DOMAIN = "AUTH0_DOMAIN",
  SPEECH_KEY = "SPEECH_KEY",
  SPEECH_REGION = "SPEECH_REGION",
  GIFY_API_KEY = "GIFY_API_KEY",
}

const secretClient = new AWS.SecretsManager();

export async function fetchSecret({
  secretName,
  projectConfig: { env, projectName },
}: {
  secretName: SecretName;
  projectConfig: ProjectConfig;
}): Promise<[SecretName, string]> {
  const fullSecretName = `${env}/${projectName}/${secretName}`;

  const params: AWS.SecretsManager.GetSecretValueRequest = {
    SecretId: fullSecretName,
  };

  try {
    const data = await secretClient.getSecretValue(params).promise();
    const secretValueJson = JSON.parse(data.SecretString ?? "");

    const secretValueResult = z
      .object({
        [secretName]: z.string().nonempty(),
      })
      .parse(secretValueJson);

    return [secretName, secretValueResult[secretName]];
  } catch (error) {
    console.error("Error retrieving secret value:", error);
    throw error;
  }
}

export function getSecretValueFromEnv(secretName: SecretName) {
  try {
    return z.string().nonempty().parse(process.env[secretName]);
  } catch (err) {
    console.error(`error retrieving secret ${secretName}`);
    throw err;
  }
}
