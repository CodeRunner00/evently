import axios from "axios";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import type { NextApiRequest, NextApiResponse } from "next";
import initConnection from "../../../lib/mongodb";
import userModel from "../../../lib/models";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await unstable_getServerSession(req, res, authOptions);
  if (!session) res.status(404).send({ error: "Not authorized" });
  await initConnection();

  try {
    const existingUser = await userModel.findOne({
      email: session?.user?.email,
    });

    res.status(200).send(existingUser);
    return;
  } catch (err) {
    console.log("error finding user.. ", err);
    res.status(500);
    return;
  }
}
