// This is an example of to protect an API route
import { unstable_getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]"
import clientPromise from '../../../lib/mongodb'
const userModel = require("../../../lib/models");
import axios from 'axios'
import Geohash from 'latlon-geohash'

import type { NextApiRequest, NextApiResponse } from "next"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // axios.defaults.headers.common['Authorization'] = "Bearer " + 'sflbwArvQG9JgEl8'
  const geoHash = Geohash.encode(40.7128, 74.0060, 9)
  // const point = new GeoPoint(40.7128, 74.0060)
  // const geoJson = point.toGeoJSON();
  // console.log('getJson ', geoJson)
  // console.log('geoHash is', geoHash)

  const { zip, radius } = req.query;
  console.log('params are ', req.query)
  let allEvents = []
  const session = await unstable_getServerSession(req, res, authOptions)
  console.log('server session is ', session);
  if (session) {
    const axiosConfig = {
      headers: {
          'Content-Type': 'application/json;charset=UTF-8',
          "Access-Control-Allow-Origin": "*",
          'Retry-After': 1200
      }
    };
    let locationInfo = null;
    // let zip = '08742'
    // let radius = 20
    try {
      const locationInfoResponse = await fetch(`https://thezipcodes.com/api/v1/search?zipCode=${zip}&countryCode=US&apiKey=fc6722a6fb8af205861e703da4531654`)
      locationInfo = (await locationInfoResponse.json())
    } catch(err) {
      console.log('unable to get location info ', err)
    }
    const { latitude: lat, longitude: long } = locationInfo?.location?.[0]
    console.log('locationInfo for zip ', zip, ' is ', lat, ', ', long)
    let response: any
    try {
      response = await axios.get(`https://app.ticketmaster.com/discovery/v2/events.json?apikey=o3jjhJKgxGGnSFsvaHDBcYH7PpYMFIou&latlong=${lat},${long}&radius=${radius}`)
      // console.log('response ', response)
      let nextPage = response?.data?._links?.next?.href
      allEvents = [...response?.data?._embedded?.events]
      await clientPromise
      
      const existingUser = await userModel.find({email: session?.user?.email})

      console.log('existingUser is ', existingUser)

      if (!existingUser.length) {
        const user = new userModel({email: session.user?.email, eventIds: allEvents?.map(({id}) => id)});
        console.log('user is ', user)
        try {
          await user.save();
          return res.send(user);
        } catch (error) {
          return res.status(500).send(error);
        }
      }


      // console.log('mongodbClient is ', mongodbClient)

      //   try {
      //     console.log('nextPage is ', `https://app.ticketmaster.com`+nextPage)
      //     const resp = await axios.get(`https://app.ticketmaster.com${nextPage}&apikey=o3jjhJKgxGGnSFsvaHDBcYH7PpYMFIou`, axiosConfig)
      //     console.log('next reponse ', resp)
      //     allEvents = [...allEvents, resp?.data?._embedded?.events]
      //   } catch (err) {
      //     console.log('inn error block while loop ', err)
      //     res.send({ props: {data: allEvents} })
      //   }
      // console.log('returning response ');
      res.send(existingUser[0]);
    } catch(err) {
      console.log('error is ', err)
      res.send({
        error: "There was an error.",
      })
    }
  }
  


}
