/**
 * Group memories by their associated place.
 */
export function groupMemoriesByPlace(memories) {
  const groups = {};
  for (const memory of memories) {
    const key = memory.place_id || 'unknown';
    if (!groups[key]) {
      groups[key] = {
        placeId: memory.place_id,
        placeName: memory.place_name || 'Unknown Place',
        latitude: memory.latitude,
        longitude: memory.longitude,
        memories: [],
      };
    }
    groups[key].memories.push(memory);
  }
  return Object.values(groups);
}

/**
 * Calculate distance between two coordinates in km.
 */
export function getDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg) {
  return deg * (Math.PI / 180);
}
