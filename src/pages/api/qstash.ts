import type { NextApiRequest, NextApiResponse } from "next";
import { verifySignature } from "@upstash/qstash/dist/nextjs";
import clerk from "@clerk/clerk-sdk-node";
import { TwitterApi } from "twitter-api-v2";
import { env } from "@/env.mjs";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log("req.headers", req.headers);

  const { userId } = req.body as unknown as { userId?: string };

  if (!userId) {
    return res.status(400).json({ error: "Missing userId" });
  }

  const [OAuthAccessToken] = await clerk.users.getUserOauthAccessToken(
    userId,
    "oauth_twitter",
  );

  if (!OAuthAccessToken) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  console.log("twitter access token: ", OAuthAccessToken);

  // const twitterClient = new TwitterApi({
  //   appKey: env.TWITTER_APP_KEY,
  //   appSecret: env.TWITTER_APP_SECRET,
  //   accessToken: OAuthAccessToken.token,
  //   accessSecret: OAuthAccessToken.tokenSecret,
  // });

  // const user = await twitterClient.v2.me();
  // console.log("twitter user", user);

  await new Promise((r) => setTimeout(r, 1000));

  console.log("Success");
  console.log(typeof req.body, { body: req.body as unknown });
  res.status(200).json({ name: "John Doe", body: req.body as unknown });
}

export default verifySignature(handler);

export const config = {
  api: {
    bodyParser: false,
  },
};
