# nomad Development Guidelines

Auto-generated from all feature plans. Last updated: 2026-03-15

## Active Technologies

- TypeScript 5.x (strict mode) / Node.js 18+
- React Native + Expo SDK (managed workflow)
- react-native-paper v5+ (Material Design 3)
- react-native-maps (地図・マーカー)
- expo-location (現在地取得)
- @gorhom/bottom-sheet v5 (店舗詳細ボトムシート)
- expo-router (ファイルベースルーティング)
- Jest + React Native Testing Library (テスト)

## Project Structure

```text
app/
  _layout.tsx       # Expo Router ルートレイアウト
  index.tsx         # マップ画面

src/
  components/       # UI コンポーネント
  data/             # 固定モックデータ（chains.ts, venues.ts）
  hooks/            # useLocation, useVenues
  services/         # venueService（データアクセス抽象）
  types/            # 型定義（venue.ts）
  utils/            # distance.ts（Haversine 計算）

__tests__/
  utils/
  hooks/
  components/
```

## Commands

```bash
npx expo start          # 開発サーバー起動
npm test                # テスト実行
npm test -- --watch     # ウォッチモード
npm run lint            # ESLint
```

## Code Style

- TypeScript strict モード必須
- コンポーネントは関数コンポーネント + hooks のみ
- Props 型は interface で定義（inline 型定義禁止）
- MD3 デザイントークンを使用し、ハードコードのデザイン値禁止
- グローバル状態管理なし（useState / useReducer のみ）

## Recent Changes

- 001-wifi-workspace-map: Added TypeScript 5.x（strict モード）/ Node.js 18+

<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
