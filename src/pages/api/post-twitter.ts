import type { NextApiRequest, NextApiResponse } from "next";
import { verifySignature } from "@upstash/qstash/dist/nextjs";
import clerk from "@clerk/clerk-sdk-node";
import { TwitterApi } from "twitter-api-v2";
import { env } from "@/env.mjs";
import * as z from "zod";
import { isClerkAPIResponseError } from "@clerk/nextjs";
import { type OauthAccessToken } from "@clerk/nextjs/dist/types/server";

const bodySchema = z.object({
  userId: z.string(),
  content: z.string(),
});

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const parsingResult = bodySchema.safeParse(req.body);

  if (!parsingResult.success) {
    return res
      .status(400)
      .json({ error: parsingResult.error.flatten().fieldErrors });
  }

  const { userId, content } = parsingResult.data;

  let tokens: OauthAccessToken[];
  try {
    tokens = await clerk.users.getUserOauthAccessToken(userId, "oauth_twitter");
  } catch (error) {
    if (isClerkAPIResponseError(error)) {
      return res.status(400).json({ error: error.errors[0]?.longMessage });
    } else {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  const [OAuthAccessToken] = tokens;
  if (!OAuthAccessToken) {
    return res.status(400).json({ error: "No Twitter account linked" });
  }

  try {
    const twitterClient = new TwitterApi({
      appKey: env.TWITTER_APP_KEY,
      appSecret: env.TWITTER_APP_SECRET,
      accessToken: OAuthAccessToken.token,
      accessSecret: OAuthAccessToken.tokenSecret,
    });

    const { data: createdTweet } = await twitterClient.v2.tweet(content);
    res.status(201).json({
      tweetId: createdTweet.id,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export default verifySignature(handler);

export const config = {
  api: {
    bodyParser: false,
  },
};
