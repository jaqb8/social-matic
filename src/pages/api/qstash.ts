import type { NextApiRequest, NextApiResponse } from "next";
import { verifySignature } from "@upstash/qstash/dist/nextjs";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log(req.headers);

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
