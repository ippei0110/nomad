import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EmptyState } from '@/components/EmptyState';
import { VenueMapView } from '@/components/VenueMapView';
import { useLocation } from '@/hooks/useLocation';
import { useVenues } from '@/hooks/useVenues';
import { VenueWithDistance, ViewMode } from '@/types/venue';

export default function MapScreen() {
  const { location, error: locationError, isLoading } = useLocation();
  const venues = useVenues(location);

  // TODO(US2): ViewModeToggle と VenueList を追加するときに使用する
  const [viewMode] = useState<ViewMode>('map');
  // TODO(US3): VenueBottomSheet を追加するときに使用する
  const [, setSelectedVenue] = useState<VenueWithDistance | null>(null);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text variant="headlineSmall" style={styles.title}>
          Nomad
        </Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          近くの Wi-Fi 付き作業スペースを探す
        </Text>
      </View>

      {/* TODO(US2): ViewModeToggle をここに追加 */}

      <View style={styles.content}>
        {isLoading && (
          <View style={styles.centered}>
            <ActivityIndicator size="large" />
            <Text variant="bodyMedium" style={styles.loadingText}>
              現在地を取得中...
            </Text>
          </View>
        )}

        {!isLoading && locationError && <EmptyState type="location_error" />}

        {!isLoading && !locationError && location && venues.length === 0 && (
          <EmptyState type="no_venues" />
        )}

        {!isLoading && !locationError && location && venues.length > 0 && viewMode === 'map' && (
          <VenueMapView
            userLocation={location}
            venues={venues}
            onVenuePress={setSelectedVenue}
          />
        )}

        {/* TODO(US2): viewMode === 'list' のとき VenueList */}
      </View>

      {/* TODO(US3): VenueBottomSheet をここに追加 */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontWeight: 'bold',
  },
  subtitle: {
    marginTop: 2,
    opacity: 0.6,
  },
  content: {
    flex: 1,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  loadingText: {
    opacity: 0.6,
  },
});
