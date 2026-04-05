import { StyleSheet, View } from 'react-native';
import { SegmentedButtons } from 'react-native-paper';

import { ViewMode } from '@/types/venue';

interface ViewModeToggleProps {
  mode: ViewMode;
  onChange: (mode: ViewMode) => void;
}

export function ViewModeToggle({ mode, onChange }: ViewModeToggleProps) {
  return (
    <View style={styles.container}>
      <SegmentedButtons
        value={mode}
        onValueChange={(value) => onChange(value as ViewMode)}
        buttons={[
          { value: 'map', label: '地図', icon: 'map' },
          { value: 'list', label: 'リスト', icon: 'format-list-bulleted' },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
});
