import axios from "axios";
import { useRouter } from "next/router";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "../../../auth/[...nextauth]";
import type { NextApiRequest, NextApiResponse } from "next";
const initConnection = require("../../../../../lib/mongodb");
const userModel = require("../../../../../lib/models");

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // axios.defaults.headers.common['Authorization'] = "Bearer " + 'sflbwArvQG9JgEl8'
  // const point = new GeoPoint(40.7128, 74.0060)
  // const geoJson = point.toGeoJSON();
  // console.log('getJson ', geoJson)
  // console.log('geoHash is', geoHash)

  const { dynamicId } = req.query;
  const session = await unstable_getServerSession(req, res, authOptions);
  if (!session) res.status(404).send({ error: "Not authorized" });
  await initConnection();

  try {
    const existingUser = await userModel.findOne({
      email: session?.user?.email,
    });
    console.log("existing user in my-events ", existingUser);
    if (!existingUser) {
      res.status(400);
      return;
    }

    const filteredEvents = existingUser.events.filter(
      ({ eventId }: { eventId: string }): Boolean => eventId !== dynamicId
    );

    existingUser.events = filteredEvents;
    await existingUser.save();

    res.status(200).send(existingUser);
  } catch (err) {
    console.log("error finding user.. ", err);
  }
}
