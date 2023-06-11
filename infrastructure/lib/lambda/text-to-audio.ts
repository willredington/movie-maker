import { Handler } from "aws-lambda";
import * as AWS from "aws-sdk";
import * as tts from "microsoft-cognitiveservices-speech-sdk";
import { PassThrough } from "stream";
import { RunTimeEnvVariable, getEnvVariable } from "../config";
import { ProjectSection } from "../model";
import { SecretName, getSecretValueFromEnv } from "../service/secret";

const s3 = new AWS.S3();

const speechConfig = tts.SpeechConfig.fromSubscription(
  getSecretValueFromEnv(SecretName.SPEECH_KEY),
  getSecretValueFromEnv(SecretName.SPEECH_REGION)
);

export const handler: Handler = async (incomingEvent): Promise<string> => {
  console.log(incomingEvent);

  const section = ProjectSection.parse(incomingEvent);

  const synthesizer = new tts.SpeechSynthesizer(speechConfig);

  try {
    const ttsResult = await new Promise<PassThrough>((resolve, reject) => {
      synthesizer.speakTextAsync(
        section.text,
        (result) => {
          if (result.reason === tts.ResultReason.SynthesizingAudioCompleted) {
            const { audioData } = result;
            // https://learn.microsoft.com/en-us/azure/cognitive-services/speech-service/how-to-speech-synthesis?pivots=programming-language-javascript&tabs=browserjs%2Cterminal
            const bufferStream = new PassThrough();
            bufferStream.end(Buffer.from(audioData));
            resolve(bufferStream);
          }
        },
        (error) => {
          console.error(error);
          reject("there was an issue transcribing the audio");
        }
      );
    });

    const bucketResult = await s3
      .upload({
        Bucket: getEnvVariable(RunTimeEnvVariable.AUDIO_BUCKET_NAME),
        Key: `${section.id}.wav`,
        ContentType: "audio/wav",
        Body: ttsResult,
      })
      .promise();

    return bucketResult.Location;
  } catch (err) {
    throw err;
  } finally {
    synthesizer.close();
  }
};

export default handler;
