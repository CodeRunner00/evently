import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "../../../auth/[...nextauth]";
import type { NextApiRequest, NextApiResponse } from "next";
const initConnection = require("../../../../../lib/mongodb");
const userModel = require("../../../../../lib/models");

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // if (!session) res.status(404).send({ error: "Not authorized" });
  await initConnection();

  const { email } = req.query;

  try {
    const existingUser = await userModel.findOne({
      email,
    });
    console.log("existing user in my-events ", existingUser);
    if (!existingUser) {
      res.send({ events: [] });
      return;
    }

    res.status(200).send({ events: existingUser.events });
    return;
  } catch (err) {
    console.log("error finding user.. ", err);
    res.send({ events: [] });
    return;
  }
}
