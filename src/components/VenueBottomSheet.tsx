import { useCallback, useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { Chip, Text } from 'react-native-paper';

import { VenueWithDistance } from '@/types/venue';

interface VenueBottomSheetProps {
  venue: VenueWithDistance | null;
  onClose: () => void;
}

const SNAP_POINTS = ['40%'];

export function VenueBottomSheet({ venue, onClose }: VenueBottomSheetProps) {
  const bottomSheetRef = useRef<BottomSheet>(null);

  useEffect(() => {
    if (venue) {
      bottomSheetRef.current?.expand();
    } else {
      bottomSheetRef.current?.close();
    }
  }, [venue]);

  const handleSheetChange = useCallback(
    (index: number) => {
      if (index === -1) {
        onClose();
      }
    },
    [onClose],
  );

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={SNAP_POINTS}
      enablePanDownToClose
      onChange={handleSheetChange}
    >
      <BottomSheetView style={styles.content}>
        {venue && (
          <>
            <Text variant="titleMedium" style={styles.venueName}>
              {venue.chain.name} {venue.name}
            </Text>

            <View style={styles.wifiRow}>
              <Chip
                compact
                style={[styles.chip, venue.chain.hasWifi ? styles.chipWifi : styles.chipNoWifi]}
                textStyle={styles.chipText}
              >
                {venue.chain.hasWifi ? 'Wi-Fi あり' : 'Wi-Fi なし'}
              </Chip>
            </View>

            <Text variant="bodyMedium" style={styles.price}>
              {venue.chain.cheapestItem
                ? `${venue.chain.cheapestItem.name}　¥${venue.chain.cheapestItem.priceYen}（税込）`
                : '価格情報なし'}
            </Text>

            <Text variant="bodySmall" style={styles.address}>
              {venue.address}
            </Text>
          </>
        )}
      </BottomSheetView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 8,
    gap: 12,
  },
  venueName: {
    fontWeight: 'bold',
  },
  wifiRow: {
    flexDirection: 'row',
  },
  chip: {
    alignSelf: 'flex-start',
  },
  chipWifi: {
    backgroundColor: '#d4edda',
  },
  chipNoWifi: {
    backgroundColor: '#e9ecef',
  },
  chipText: {
    fontSize: 13,
  },
  price: {
    color: '#1a6e1a',
  },
  address: {
    opacity: 0.6,
  },
});
