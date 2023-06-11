import {
  APIGatewayAuthorizerResult,
  APIGatewayTokenAuthorizerEvent,
  APIGatewayTokenAuthorizerHandler,
} from "aws-lambda";
import * as jwt from "jsonwebtoken";
import { JwksClient } from "jwks-rsa";
import { z } from "zod";
import { SecretName, getSecretValueFromEnv } from "../service/secret";

const JwtPayload = z.object({
  sub: z.string(),
});

type JwtPayload = z.infer<typeof JwtPayload>;

const auth0Domain = getSecretValueFromEnv(SecretName.AUTH0_DOMAIN);

const jwksUri = `https://${auth0Domain}/.well-known/jwks.json`;

export const handler: APIGatewayTokenAuthorizerHandler = async (
  event: APIGatewayTokenAuthorizerEvent
): Promise<APIGatewayAuthorizerResult> => {
  try {
    const token = event.authorizationToken;

    const client = new JwksClient({
      jwksUri,
    });

    const getKey = (header: any, callback: any) => {
      client.getSigningKey(header.kid, (err: any, key: any) => {
        const signingKey = key.publicKey || key.rsaPublicKey;
        callback(null, signingKey);
      });
    };

    const decodedToken = await new Promise<JwtPayload>((resolve, reject) => {
      jwt.verify(
        token,
        getKey,
        {
          issuer: `https://${auth0Domain}/`,
          algorithms: ["RS256"],
        },
        (err, decoded) => {
          if (err) {
            reject(err);
          } else {
            resolve(JwtPayload.parse(decoded));
          }
        }
      );
    });

    // Access the decoded token
    const userId = decodedToken.sub;

    // If authentication is successful, return an IAM policy for the user
    const authorizerResult: APIGatewayAuthorizerResult = {
      principalId: userId,
      context: {
        userId,
      },
      policyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Action: "execute-api:Invoke",
            Effect: "Allow",
            Resource: event.methodArn,
          },
        ],
      },
    };

    return authorizerResult;
  } catch (error) {
    // Handle authentication failure
    console.error("Authentication failed:", error);

    // Return a 401 Unauthorized response
    throw new Error("Unauthorized");
  }
};
