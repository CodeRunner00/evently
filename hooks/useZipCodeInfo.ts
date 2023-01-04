import swr from 'swr'
import Geohash from 'latlon-geohash'


export const useZipCodeInfo = (zip: string): any => async {

      // axios.defaults.headers.common['Authorization'] = "Bearer " + 'sflbwArvQG9JgEl8'
//   const geoHash = Geohash.encode(40.7128, 74.0060, 9)
  // const point = new GeoPoint(40.7128, 74.0060)
  // const geoJson = point.toGeoJSON();
  // console.log('getJson ', geoJson)
  // console.log('geoHash is', geoHash)
  let locationInfo = null
//   let zip 
  try {
    zip = '08742'
    const locationInfoResponse = await fetch(`https://thezipcodes.com/api/v1/search?zipCode=${zip}&countryCode=US&apiKey=fc6722a6fb8af205861e703da4531654`)
    locationInfo = (await locationInfoResponse.json())
  } catch(err) {
    console.log('unable to get location info ', err)
  }

  const { latitude: lat, longitude: long } = locationInfo?.location?.[0]
  console.log('locationInfo for zip ', zip, ' is ', lat, ', ', long)
  let res = { data: null}
  try {

    res = await fetch(`https://app.ticketmaster.com/discovery/v2/events.json?apikey=o3jjhJKgxGGnSFsvaHDBcYH7PpYMFIou&latlong=${lat},${long}&radius=15`)
    return { props: {data: res.data} }
  } catch(err) {
    console.log('error is ', err)
    return {
      props: {err: 'There was an error'}
    }
  }

}