import axios from 'axios';

const req = axios.create();
const __KEY = "use_your_key";

export function currentCoordinates() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      ({
        coords
      }) => resolve(coords),
      // Reject if the user doesn't
      // allow accessing their location.
      error => reject(error),
    );
  });
}

export async function addressByCoordinates({
  latitude,
  longitude,
}) {
  const latlng = latitude + "," + longitude;

  const {
    data
  } =
  await req.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latlng}&key=${__KEY}`);
  return data.results;
}

export async function currentAddress() {
  const coordinates = await currentCoordinates();

  return addressByCoordinates(coordinates);
}
