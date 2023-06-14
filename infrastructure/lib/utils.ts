export const DEFAULT_CORS_HEADERS = {
  "Access-Control-Allow-Headers":
    "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent",
  "Access-Control-Allow-Methods": "*",
  "Access-Control-Allow-Origin": "*",
};

export const DEFAULT_HTTP_HEADERS = {
  ...DEFAULT_CORS_HEADERS,
  "Content-Type": "application/json",
};
