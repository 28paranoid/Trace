/**
 * Extract EXIF data from an image asset.
 * expo-image-picker returns exif data when requested.
 */
export function extractLocationFromExif(exif) {
  if (!exif) return null;

  const { GPSLatitude, GPSLongitude, GPSLatitudeRef, GPSLongitudeRef } = exif;

  if (!GPSLatitude || !GPSLongitude) return null;

  let latitude = GPSLatitude;
  let longitude = GPSLongitude;

  if (GPSLatitudeRef === 'S') latitude = -latitude;
  if (GPSLongitudeRef === 'W') longitude = -longitude;

  return { latitude, longitude };
}

export function extractDateFromExif(exif) {
  if (!exif?.DateTimeOriginal) return null;

  // EXIF date format: "YYYY:MM:DD HH:MM:SS"
  const parts = exif.DateTimeOriginal.replace(':', '-').replace(':', '-');
  return new Date(parts);
}
