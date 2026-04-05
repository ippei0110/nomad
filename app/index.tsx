import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EmptyState } from '@/components/EmptyState';
import { VenueBottomSheet } from '@/components/VenueBottomSheet';
import { VenueList } from '@/components/VenueList';
import { VenueMapView } from '@/components/VenueMapView';
import { ViewModeToggle } from '@/components/ViewModeToggle';
import { useLocation } from '@/hooks/useLocation';
import { useVenues } from '@/hooks/useVenues';
import { VenueWithDistance, ViewMode } from '@/types/venue';

export default function MapScreen() {
  const { location, error: locationError, isLoading } = useLocation();
  const venues = useVenues(location);

  const [viewMode, setViewMode] = useState<ViewMode>('map');
  const [selectedVenue, setSelectedVenue] = useState<VenueWithDistance | null>(null);

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

      <ViewModeToggle mode={viewMode} onChange={setViewMode} />

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
          <VenueMapView userLocation={location} venues={venues} onVenuePress={setSelectedVenue} />
        )}

        {!isLoading && !locationError && viewMode === 'list' && (
          <VenueList venues={venues} onVenuePress={setSelectedVenue} />
        )}
      </View>

      <VenueBottomSheet venue={selectedVenue} onClose={() => setSelectedVenue(null)} />
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
