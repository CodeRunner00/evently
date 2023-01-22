// This is an example of to protect an API route
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import axios from "axios";
const initConnection = require("../../../lib/mongodb");
const userModel = require("../../../lib/models");

import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.status(405).send({ message: "Only POST requests allowed" });
    return;
  }

  const body = req.body;
  const session = await unstable_getServerSession(req, res, authOptions);
  console.log("server session is ", session);
  await initConnection();

  try {
    const existingUser = await userModel.findOne({
      email: session?.user?.email,
    });
    console.log("existing user in my-events ", existingUser);
    if (!existingUser) {
      res.status(400).send({ email: session?.user?.email });
      return;
    }
  } catch (err) {
    console.log("error finding user.. ", err);
  }
  if (session) {
    try {
      const existingUser = await userModel.findOne({
        email: session?.user?.email,
      });

      try {
        existingUser.events.push(body);
        await existingUser.save();
        console.log("existingUser saved is ", existingUser);
        return res.send(existingUser);
      } catch (error) {
        return res.status(500).send(error);
      }
    } catch (err) {
      console.log("error is ", err);
      res.send({
        error: "There was an error.",
      });
    }
  }

  res.status(404).send({ message: "User must be signed in to save events" });
}
