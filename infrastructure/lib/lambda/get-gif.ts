import { Handler } from "aws-lambda";
import * as AWS from "aws-sdk";
import axios from "axios";
import { RunTimeEnvVariable, getEnvVariable } from "../config";
import { ProjectSection } from "../model";
import { getGIFs } from "../service/gif";

const s3 = new AWS.S3();

export const handler: Handler = async (incomingEvent): Promise<string> => {
  console.log(incomingEvent);

  const section = ProjectSection.parse(incomingEvent);

  const gifResult = await getGIFs(section.gifHint);

  console.log("GIF RESULT", gifResult.data);

  if (gifResult.data.length) {
    const gif = gifResult.data[0].images.downsized;

    const gifStreamResult = await axios.get<ReadableStream>(gif.url, {
      responseType: "stream",
    });

    const bucketResult = await s3
      .upload({
        Bucket: getEnvVariable(RunTimeEnvVariable.GIF_BUCKET_NAME),
        Key: `${section.id}.gif`,
        ContentType: "image/gif",
        Body: gifStreamResult.data,
      })
      .promise();

    return bucketResult.Location;
  }

  throw new Error("could not find a GIF for section");
};

export default handler;
