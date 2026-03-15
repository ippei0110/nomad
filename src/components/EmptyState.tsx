import { Linking, StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';

interface EmptyStateProps {
  type: 'no_venues' | 'location_error' | 'offline';
  onRetry?: () => void;
}

const MESSAGES: Record<EmptyStateProps['type'], { icon: string; title: string; body: string }> = {
  no_venues: {
    icon: '🔍',
    title: '近くに対象店舗が見つかりません',
    body: '半径 1km 以内に Wi-Fi 付きチェーン店が見つかりませんでした。',
  },
  location_error: {
    icon: '📍',
    title: '位置情報を取得できませんでした',
    body: '設定アプリで位置情報の使用を許可してください。',
  },
  offline: {
    icon: '📡',
    title: 'インターネットに接続できません',
    body: 'ネットワーク接続を確認してから、もう一度お試しください。',
  },
};

export function EmptyState({ type, onRetry }: EmptyStateProps) {
  const { icon, title, body } = MESSAGES[type];

  return (
    <View style={styles.container}>
      <Text style={styles.icon}>{icon}</Text>
      <Text variant="titleMedium" style={styles.title}>
        {title}
      </Text>
      <Text variant="bodyMedium" style={styles.body}>
        {body}
      </Text>
      {type === 'location_error' && (
        <Button mode="outlined" onPress={() => Linking.openSettings()} style={styles.button}>
          設定を開く
        </Button>
      )}
      {onRetry && (
        <Button mode="text" onPress={onRetry} style={styles.button}>
          再試行
        </Button>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 8,
  },
  icon: {
    fontSize: 48,
    marginBottom: 8,
  },
  title: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
  body: {
    textAlign: 'center',
    opacity: 0.6,
  },
  button: {
    marginTop: 8,
  },
});
