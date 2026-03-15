import * as Location from 'expo-location';
import { useEffect, useState } from 'react';

import { LocationError, UserLocation } from '@/types/venue';

interface UseLocationReturn {
  location: UserLocation | null;
  error: LocationError | null;
  isLoading: boolean;
}

/**
 * 現在地を取得する。
 * - マウント時に 1 度だけ取得し、セッション中は固定（仕様通り）。
 * - 権限拒否・タイムアウト・取得失敗を LocationError に変換する。
 */
export function useLocation(): UseLocationReturn {
  const [location, setLocation] = useState<UserLocation | null>(null);
  const [error, setError] = useState<LocationError | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetch() {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== Location.PermissionStatus.GRANTED) {
          if (!cancelled) {
            setError({
              reason: 'permission_denied',
              message: '位置情報の使用が許可されていません。設定アプリで許可してください。',
            });
          }
          return;
        }

        const result = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        if (!cancelled) {
          setLocation({
            latitude: result.coords.latitude,
            longitude: result.coords.longitude,
          });
        }
      } catch {
        if (!cancelled) {
          setError({
            reason: 'unavailable',
            message: '位置情報の取得に失敗しました。もう一度お試しください。',
          });
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    fetch();
    return () => {
      cancelled = true;
    };
  }, []);

  return { location, error, isLoading };
}
