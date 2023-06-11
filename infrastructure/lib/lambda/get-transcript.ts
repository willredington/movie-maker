import { Handler } from "aws-lambda";
import { Configuration, OpenAIApi } from "openai";
import { z } from "zod";
import { RunTimeEnvVariable, getEnvVariable } from "../config";
import { Project, ProjectSection } from "../model";
import { SecretName, getSecretValueFromEnv } from "../service/secret";
import { SectionService } from "../service/section";

const TranscriptResponse = z.object({
  video_transcript: z.array(
    z.object({
      timestamp: z.string(),
      text: z.string(),
      gifHint: z.string(),
    })
  ),
});

const configuration = new Configuration({
  apiKey: getSecretValueFromEnv(SecretName.OPENAI_API_KEY),
});

const openai = new OpenAIApi(configuration);

const MODEL = "gpt-3.5-turbo";

const INITIAL_PROMPT = `
  I want to create a video transcript based on an initial prompt about a topic.
  I'd like you to create the transcript. And for each section of the transcript, I'd like you to include both the text and a GIF hint.  For the GIF hint, it should be the search term for a GIF that goes along with whatever it is the transcript is talking about at that point in time. I'd like you to format the transcript in JSON like in the following example for a topic on the beagle dog breed:

  {
      "video_transcript": [ 
          { 
              "timestamp": "00:00:00", 
              "text": "Welcome to our video on the basic overview of the Beagle dog breed!",
              "gifHint": "beagle puppy" 
          }
      ]
  }

  Just provide the JSON and nothing else. Make sure to keep the transcript under 5 minutes.
  Next, I will provide the topic that you will create the transcript for.
`;

export const handler: Handler = async (incomingEvent) => {
  console.log("from get transcript", incomingEvent);

  const project = Project.parse(incomingEvent);

  const completion = await openai.createChatCompletion({
    model: MODEL,
    messages: [
      {
        role: "user",
        content: INITIAL_PROMPT,
      },
      {
        role: "user",
        content: project.topic,
      },
    ],
  });

  const transcriptJsonRaw = JSON.parse(
    completion.data.choices?.[0].message?.content ?? ""
  );

  const transcriptResponseResult =
    TranscriptResponse.safeParse(transcriptJsonRaw);

  if (!transcriptResponseResult.success) {
    console.log(transcriptResponseResult.error);
    throw new Error("unexpected transcript response");
  }

  const sectionService = new SectionService(
    getEnvVariable(RunTimeEnvVariable.SECTION_TABLE_NAME)
  );

  let sectionIndex = 0;
  const sections: ProjectSection[] = [];

  for (const sectionRaw of transcriptResponseResult.data["video_transcript"]) {
    const sectionResult = await sectionService.createSection({
      text: sectionRaw.text,
      order: sectionIndex,
      projectId: project.id,
      gifHint: sectionRaw.gifHint,
    });

    sections.push(sectionResult.unwrap());

    sectionIndex++;
  }

  return sections;
};

export default handler;
