import MapView, { Callout, Marker, Region } from 'react-native-maps';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

import { UserLocation, VenueWithDistance } from '@/types/venue';

interface VenueMapViewProps {
  userLocation: UserLocation;
  venues: VenueWithDistance[];
  onVenuePress: (venue: VenueWithDistance) => void;
}

const INITIAL_DELTA = 0.02; // 表示範囲 約 2km

function toRegion(location: UserLocation): Region {
  return {
    latitude: location.latitude,
    longitude: location.longitude,
    latitudeDelta: INITIAL_DELTA,
    longitudeDelta: INITIAL_DELTA,
  };
}

export function VenueMapView({ userLocation, venues, onVenuePress }: VenueMapViewProps) {
  return (
    <MapView
      style={styles.map}
      initialRegion={toRegion(userLocation)}
      showsUserLocation
      showsMyLocationButton
    >
      {venues.map((venue) => (
        <Marker
          key={venue.id}
          coordinate={venue.location}
          onPress={() => onVenuePress(venue)}
        >
          <Callout onPress={() => onVenuePress(venue)}>
            <View style={styles.callout}>
              <Text variant="labelMedium" style={styles.calloutChain}>
                {venue.chain.name}
              </Text>
              <Text variant="bodySmall" style={styles.calloutName}>
                {venue.name}
              </Text>
              <Text variant="bodySmall" style={styles.calloutPrice}>
                {venue.chain.cheapestItem.name}　¥{venue.chain.cheapestItem.priceYen}〜
              </Text>
            </View>
          </Callout>
        </Marker>
      ))}
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  callout: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    minWidth: 180,
    gap: 2,
  },
  calloutChain: {
    fontWeight: 'bold',
  },
  calloutName: {
    opacity: 0.7,
  },
  calloutPrice: {
    marginTop: 4,
    color: '#1a6e1a',
  },
});
