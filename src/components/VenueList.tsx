import { FlatList, StyleSheet } from 'react-native';
import { Divider, List } from 'react-native-paper';

import { EmptyState } from '@/components/EmptyState';
import { VenueWithDistance } from '@/types/venue';

interface VenueListProps {
  venues: VenueWithDistance[];
  onVenuePress: (venue: VenueWithDistance) => void;
}

export function VenueList({ venues, onVenuePress }: VenueListProps) {
  if (venues.length === 0) {
    return <EmptyState type="no_venues" />;
  }

  return (
    <FlatList
      data={venues}
      keyExtractor={(item) => item.id}
      ItemSeparatorComponent={() => <Divider />}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => (
        <List.Item
          title={`${item.chain.name} ${item.name}`}
          description={`${item.distanceMeters}m · ${item.chain.cheapestItem.name} ¥${item.chain.cheapestItem.priceYen}`}
          onPress={() => onVenuePress(item)}
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    flexGrow: 1,
  },
});
