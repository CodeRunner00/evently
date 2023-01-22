import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";
import type { NextApiRequest, NextApiResponse } from "next";
const initConnection = require("../../../lib/mongodb");
const userModel = require("../../../lib/models");

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // axios.defaults.headers.common['Authorization'] = "Bearer " + 'sflbwArvQG9JgEl8'
  // const point = new GeoPoint(40.7128, 74.0060)
  // const geoJson = point.toGeoJSON();
  // console.log('getJson ', geoJson)
  // console.log('geoHash is', geoHash)
  const session = await unstable_getServerSession(req, res, authOptions);
  if (!session) res.status(404).send({ error: "Not authorized" });
  await initConnection();

  try {
    const existingUser = await userModel.findOne({
      email: session?.user?.email,
    });
    console.log("existing user in my-events ", existingUser);
    if (!existingUser) {
      res.send({ events: [] });
    }

    res.status(200).send({ events: existingUser.events });
  } catch (err) {
    console.log("error finding user.. ", err);
    res.send({ events: [] });
  }
}
