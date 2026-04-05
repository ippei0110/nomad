import { UserLocation } from '@/types/venue';

const EARTH_RADIUS_METERS = 6371000;

/**
 * Haversine 公式で 2 点間の距離をメートル単位で返す。
 * 返り値は整数（Math.round）。
 */
export function calcDistanceMeters(
  from: Pick<UserLocation, 'latitude' | 'longitude'>,
  to: Pick<UserLocation, 'latitude' | 'longitude'>,
): number {
  const lat1 = toRad(from.latitude);
  const lat2 = toRad(to.latitude);
  const deltaLat = toRad(to.latitude - from.latitude);
  const deltaLon = toRad(to.longitude - from.longitude);

  const a =
    Math.sin(deltaLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(EARTH_RADIUS_METERS * c);
}

function toRad(degrees: number): number {
  return (degrees * Math.PI) / 180;
}
