import * as Location from 'expo-location';

export async function reverseGeocode(latitude, longitude) {
  try {
    const results = await Location.reverseGeocodeAsync({ latitude, longitude });
    if (results && results.length > 0) {
      const place = results[0];
      return {
        name: place.name,
        street: place.street,
        city: place.city,
        region: place.region,
        country: place.country,
        postalCode: place.postalCode,
        formattedAddress: formatAddress(place),
      };
    }
  } catch (err) {
    console.error('Reverse geocoding error:', err);
  }
  return null;
}

function formatAddress(place) {
  const parts = [place.name, place.street, place.city, place.region, place.country].filter(Boolean);
  return parts.join(', ');
}
