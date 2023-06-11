import { APIGatewayProxyEvent, APIGatewayProxyHandler } from "aws-lambda";
import { z } from "zod";
import { getGIFs } from "../service/gif";

const Event = z.object({
  searchTerm: z.string(),
});

export const handler: APIGatewayProxyHandler = async (
  incomingEvent: APIGatewayProxyEvent
) => {
  const eventResult = Event.safeParse(JSON.parse(incomingEvent.body ?? ""));

  if (!eventResult.success) {
    return {
      statusCode: 400,
      body: "Invalid request body",
    };
  }

  const event = eventResult.data;

  try {
    const gifResult = await getGIFs(event.searchTerm);
    return {
      statusCode: 200,
      body: JSON.stringify(gifResult),
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: "An unknown error occurred",
    };
  }
};

export default handler;
