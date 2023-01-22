import axios from 'axios'

import type { NextApiRequest, NextApiResponse } from "next"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // axios.defaults.headers.common['Authorization'] = "Bearer " + 'sflbwArvQG9JgEl8'
  // const point = new GeoPoint(40.7128, 74.0060)
  // const geoJson = point.toGeoJSON();
  // console.log('getJson ', geoJson)
  // console.log('geoHash is', geoHash)

  const { zip, radius, page = 0 } = req.query;
  console.log('query params zip ', zip, ' and radius ', radius)
  const locationInfo = await axios.get(`https://thezipcodes.com/api/v1/search?zipCode=${zip}&countryCode=US&apiKey=fc6722a6fb8af205861e703da4531654`)
  // console.log('locationInfo ', locationInfo)
  const { latitude: lat, longitude: long } = locationInfo?.data?.location?.[0]
  try {

    const ticketMasterResponse = await axios.get(`https://app.ticketmaster.com/discovery/v2/events.json?apikey=o3jjhJKgxGGnSFsvaHDBcYH7PpYMFIou&page=${page}&latlong=${lat},${long}&radius=${radius}&sort=date,asc`)
    console.log('ticketMaster Resopnse ', ticketMasterResponse)
    return res.send({ events: ticketMasterResponse?.data?._embedded?.events ?? [], nextPage: ticketMasterResponse?.data?._links.next ? ticketMasterResponse?.data?.page.number + 1 : null})
  } catch(err) {
    console.log('error is ', err)
    return res.status(500)
  }

}
