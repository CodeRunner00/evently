import axios from "axios";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import type { NextApiRequest, NextApiResponse } from "next";
const initConnection = require("../../../lib/mongodb");
const userModel = require("../../../lib/models");

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
    if (!existingUser) {
      const user = new userModel({ email: signedUser.email, events: [] });
      try {
        const myUser = await user.save();
        res.status(200).send(myUser);
      } catch (error) {
        res.status(500).send(error);
      }
    }

    res.status(200).send(existingUser);
  } catch (err) {
    console.log("error finding user.. ", err);
  }
}
