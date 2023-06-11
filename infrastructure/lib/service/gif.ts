import axios from "axios";
import { z } from "zod";
import { SecretName, getSecretValueFromEnv } from "../service/secret";

export const Gif = z.object({
  url: z.string(),
});

export type Gif = z.infer<typeof Gif>;

export const GifResponse = z.object({
  data: z.array(
    z.object({
      images: z.object({
        downsized: Gif,
      }),
    })
  ),
});

export async function getGIFs(searchTerm: string) {
  const result = await axios.get("http://api.giphy.com/v1/gifs/search", {
    params: {
      limit: 10,
      q: searchTerm,
      api_key: getSecretValueFromEnv(SecretName.GIFY_API_KEY),
    },
  });

  try {
    return GifResponse.parse(result.data);
  } catch (err) {
    console.error(`failed to get GIF for search term: ${searchTerm}`);
    throw err;
  }
}
