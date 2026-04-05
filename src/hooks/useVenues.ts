import { useMemo } from 'react';

import { venueService } from '@/services/venueService';
import { UserLocation, VenueWithDistance } from '@/types/venue';
import { calcDistanceMeters } from '@/utils/distance';

const DEFAULT_RADIUS_METERS = 1000;

/**
 * 現在地から指定半径内の店舗を距離昇順で返す。
 * - location が null のとき空配列を返す。
 * - chain が見つからない店舗はスキップする。
 */
export function useVenues(
  location: UserLocation | null,
  radiusMeters: number = DEFAULT_RADIUS_METERS,
): VenueWithDistance[] {
  return useMemo(() => {
    if (!location) return [];

    return venueService
      .getAllVenues()
      .reduce<VenueWithDistance[]>((acc, venue) => {
        const chain = venueService.getChainById(venue.chainId);
        if (!chain || !chain.hasWifi) return acc;

        const distanceMeters = calcDistanceMeters(location, venue.location);
        if (distanceMeters > radiusMeters) return acc;

        acc.push({ ...venue, distanceMeters, chain });
        return acc;
      }, [])
      .sort((a, b) => a.distanceMeters - b.distanceMeters);
  }, [location, radiusMeters]);
}
