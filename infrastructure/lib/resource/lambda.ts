import {
  Duration,
  aws_lambda_nodejs,
  aws_dynamodb as dynamo,
  aws_s3 as s3,
  aws_stepfunctions as sfn,
} from "aws-cdk-lib";
import { Construct } from "constructs";
import { join } from "path";
import {
  BuildTimeEnvVariable,
  ProjectConfig,
  RunTimeEnvVariable,
  getEnvVariable,
} from "../config";
import { SecretName, fetchSecret } from "../service/secret";

async function getLambdaEnvs({
  projectConfig,
  secrets,
}: {
  projectConfig: ProjectConfig;
  secrets?: SecretName[];
}): Promise<Record<string, string>> {
  const lambdaEnvVars: Record<string, string> = Object.values(
    BuildTimeEnvVariable
  ).reduce(
    (acc, curr) => ({
      ...acc,
      [curr]: getEnvVariable(curr),
    }),
    {}
  );

  if (secrets) {
    const secretResults = await Promise.all(
      secrets.map((secretName) =>
        fetchSecret({
          secretName,
          projectConfig,
        })
      )
    );

    // update the envs with the secret
    for (const [secretName, secretValue] of secretResults) {
      lambdaEnvVars[secretName] = secretValue;
    }
  }

  return lambdaEnvVars;
}

async function buildNodeJsLambda(
  scope: Construct,
  {
    projectConfig,
    functionName,
    secrets,
    overrideProps,
  }: {
    projectConfig: ProjectConfig;
    functionName: string;
    secrets?: SecretName[];
    overrideProps?: Partial<aws_lambda_nodejs.NodejsFunctionProps>;
  }
) {
  const lambdaEnvVars = await getLambdaEnvs({
    projectConfig,
    secrets,
  });

  return new aws_lambda_nodejs.NodejsFunction(scope, functionName, {
    memorySize: 1024,
    entry: join(__dirname, "../", "lambda", `${functionName}.ts`),
    ...overrideProps,
    environment: {
      ...overrideProps?.environment,
      ...lambdaEnvVars,
    },
  });
}

export async function buildAuthLambda(
  scope: Construct,
  {
    projectConfig,
  }: {
    projectConfig: ProjectConfig;
  }
) {
  return await buildNodeJsLambda(scope, {
    projectConfig,
    functionName: "auth",
    secrets: [SecretName.AUTH0_DOMAIN],
  });
}

export async function buildSearchGifLambda(
  scope: Construct,
  {
    projectConfig,
  }: {
    projectConfig: ProjectConfig;
  }
) {
  return await buildNodeJsLambda(scope, {
    projectConfig,
    functionName: "search-gif",
    secrets: [SecretName.GIFY_API_KEY],
  });
}

export async function buildTextToAudioLambda(
  scope: Construct,
  {
    projectConfig,
    audioBucket,
    projectSectionTable,
  }: {
    projectConfig: ProjectConfig;
    audioBucket: s3.IBucket;
    projectSectionTable: dynamo.ITable;
  }
) {
  const lambda = await buildNodeJsLambda(scope, {
    projectConfig,
    functionName: "text-to-audio",
    secrets: [SecretName.SPEECH_KEY, SecretName.SPEECH_REGION],
    overrideProps: {
      timeout: Duration.minutes(10),
      environment: {
        [RunTimeEnvVariable.AUDIO_BUCKET_NAME]: audioBucket.bucketName,
        [RunTimeEnvVariable.SECTION_TABLE_NAME]: projectSectionTable.tableName,
      },
    },
  });

  audioBucket.grantPut(lambda);
  projectSectionTable.grantWriteData(lambda);

  return lambda;
}

export async function buildGetTranscriptLambda(
  scope: Construct,
  {
    projectConfig,
    projectSectionTable,
  }: {
    projectConfig: ProjectConfig;
    projectSectionTable: dynamo.ITable;
  }
) {
  const lambda = await buildNodeJsLambda(scope, {
    projectConfig,
    functionName: "get-transcript",
    secrets: [SecretName.OPENAI_API_KEY],
    overrideProps: {
      timeout: Duration.minutes(10),
      environment: {
        [RunTimeEnvVariable.SECTION_TABLE_NAME]: projectSectionTable.tableName,
      },
    },
  });

  projectSectionTable.grantReadWriteData(lambda);

  return lambda;
}

export async function buildGetGifLambda(
  scope: Construct,
  {
    projectConfig,
    gifBucket,
    projectSectionTable,
  }: {
    projectConfig: ProjectConfig;
    gifBucket: s3.IBucket;
    projectSectionTable: dynamo.ITable;
  }
) {
  const lambda = await buildNodeJsLambda(scope, {
    projectConfig,
    functionName: "get-gif",
    secrets: [SecretName.GIFY_API_KEY],
    overrideProps: {
      environment: {
        [RunTimeEnvVariable.GIF_BUCKET_NAME]: gifBucket.bucketName,
        [RunTimeEnvVariable.SECTION_TABLE_NAME]: projectSectionTable.tableName,
      },
    },
  });

  projectSectionTable.grantWriteData(lambda);
  gifBucket.grantPut(lambda);

  return lambda;
}

export async function buildUpdateSectionLambda(
  scope: Construct,
  {
    projectConfig,
    projectSectionTable,
  }: {
    projectConfig: ProjectConfig;
    projectSectionTable: dynamo.ITable;
  }
) {
  const lambda = await buildNodeJsLambda(scope, {
    projectConfig,
    functionName: "update-section",
    overrideProps: {
      environment: {
        [RunTimeEnvVariable.SECTION_TABLE_NAME]: projectSectionTable.tableName,
      },
    },
  });

  projectSectionTable.grantWriteData(lambda);

  return lambda;
}

export async function buildUpdateProjectLambda(
  scope: Construct,
  {
    projectConfig,
    projectTable,
  }: {
    projectConfig: ProjectConfig;
    projectTable: dynamo.ITable;
  }
) {
  const lambda = await buildNodeJsLambda(scope, {
    projectConfig,
    functionName: "update-project",
    overrideProps: {
      environment: {
        [RunTimeEnvVariable.PROJECT_TABLE_NAME]: projectTable.tableName,
      },
    },
  });

  projectTable.grantWriteData(lambda);

  return lambda;
}

export async function buildGetProjectsLambda(
  scope: Construct,
  {
    projectConfig,
    projectTable,
  }: {
    projectConfig: ProjectConfig;
    projectTable: dynamo.ITable;
  }
) {
  const lambda = await buildNodeJsLambda(scope, {
    projectConfig,
    functionName: "get-projects",
    overrideProps: {
      environment: {
        [RunTimeEnvVariable.PROJECT_TABLE_NAME]: projectTable.tableName,
      },
    },
  });

  projectTable.grantReadWriteData(lambda);

  return lambda;
}

export async function buildStartProjectLambda(
  scope: Construct,
  {
    projectConfig,
    projectTable,
    startProjectStateMachine,
  }: {
    projectConfig: ProjectConfig;
    projectTable: dynamo.ITable;
    startProjectStateMachine: sfn.IStateMachine;
  }
) {
  const lambda = await buildNodeJsLambda(scope, {
    projectConfig,
    functionName: "start-project",
    overrideProps: {
      environment: {
        [RunTimeEnvVariable.PROJECT_TABLE_NAME]: projectTable.tableName,
        [RunTimeEnvVariable.START_PROJECT_STATE_MACHINE_ARN]:
          startProjectStateMachine.stateMachineArn,
      },
    },
  });

  projectTable.grantReadWriteData(lambda);
  startProjectStateMachine.grantStartExecution(lambda);

  return lambda;
}

export async function buildGetProjectLambda(
  scope: Construct,
  {
    projectConfig,
    projectTable,
    sectionTable,
  }: {
    projectConfig: ProjectConfig;
    projectTable: dynamo.ITable;
    sectionTable: dynamo.ITable;
  }
) {
  const lambda = await buildNodeJsLambda(scope, {
    projectConfig,
    functionName: "get-project",
    overrideProps: {
      environment: {
        [RunTimeEnvVariable.PROJECT_TABLE_NAME]: projectTable.tableName,
        [RunTimeEnvVariable.SECTION_TABLE_NAME]: sectionTable.tableName,
      },
    },
  });

  projectTable.grantReadWriteData(lambda);
  sectionTable.grantReadWriteData(lambda);

  return lambda;
}

export async function buildFinalizeProjectEventLambda(
  scope: Construct,
  {
    projectConfig,
    projectTable,
    finalizeProjectStateMachine,
  }: {
    projectConfig: ProjectConfig;
    projectTable: dynamo.ITable;
    finalizeProjectStateMachine: sfn.IStateMachine;
  }
) {
  const lambda = await buildNodeJsLambda(scope, {
    projectConfig,
    functionName: "finalize-project",
    overrideProps: {
      environment: {
        [RunTimeEnvVariable.PROJECT_TABLE_NAME]: projectTable.tableName,
        [RunTimeEnvVariable.FINALIZE_PROJECT_STATE_MACHINE_ARN]:
          finalizeProjectStateMachine.stateMachineArn,
      },
    },
  });

  projectTable.grantReadWriteData(lambda);
  finalizeProjectStateMachine.grantStartExecution(lambda);

  return lambda;
}

export async function buildCreateResultLambda(
  scope: Construct,
  {
    projectConfig,
    resultTable,
  }: {
    projectConfig: ProjectConfig;
    resultTable: dynamo.ITable;
  }
) {
  const lambda = await buildNodeJsLambda(scope, {
    projectConfig,
    functionName: "create-result",
    overrideProps: {
      environment: {
        [RunTimeEnvVariable.RESULT_TABLE_NAME]: resultTable.tableName,
      },
    },
  });

  resultTable.grantReadWriteData(lambda);

  return lambda;
}

export async function buildGetResultLambda(
  scope: Construct,
  {
    projectConfig,
    resultTable,
  }: {
    projectConfig: ProjectConfig;
    resultTable: dynamo.ITable;
  }
) {
  const lambda = await buildNodeJsLambda(scope, {
    projectConfig,
    functionName: "get-result",
    overrideProps: {
      environment: {
        [RunTimeEnvVariable.RESULT_TABLE_NAME]: resultTable.tableName,
      },
    },
  });

  resultTable.grantReadWriteData(lambda);

  return lambda;
}
