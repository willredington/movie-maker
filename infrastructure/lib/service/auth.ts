import { APIGatewayProxyEvent } from "aws-lambda";
import { z } from "zod";

const AuthorizerDetails = z.object({
  userId: z.string(),
});

export function getAuthFromEvent(proxyEvent: APIGatewayProxyEvent) {
  try {
    return AuthorizerDetails.parse(proxyEvent.requestContext.authorizer);
  } catch (err) {
    console.error("could not extract user ID from request context");
    throw err;
  }
}
