# Research: Wi-Fi 付き作業スペース マップ検索

**Branch**: `001-wifi-workspace-map` | **Date**: 2026-03-15

---

## 1. 地図ライブラリ

**Decision**: `react-native-maps` (Expo managed workflow 標準統合)

**Rationale**:
- Expo SDK に組み込み済みで追加設定不要（`expo install react-native-maps`）
- iOS / Android 双方に対応（Apple Maps / Google Maps）
- `MapView`, `Marker`, `Callout` コンポーネントが MVP に必要な機能をカバー
- Expo Go での開発時も動作確認可能

**Alternatives considered**:
- `mapbox-gl-react-native`: 高機能だが Expo managed では追加設定が複雑、MVP には過剰
- Web `react-map-gl`: React Native 非対応

---

## 2. 位置情報取得

**Decision**: `expo-location`

**Rationale**:
- Expo 公式パッケージ。iOS / Android の権限ハンドリングを統一 API で扱える
- `Location.requestForegroundPermissionsAsync()` → `Location.getCurrentPositionAsync()` の 2 ステップで完結
- 権限拒否・タイムアウトのエラーハンドリングが明確

**Alternatives considered**:
- React Native 組み込み `Geolocation`: 権限管理が platform ごとに異なり、Expo managed では非推奨

---

## 3. ボトムシート

**Decision**: `@gorhom/bottom-sheet` v5

**Rationale**:
- React Native エコシステムで最も実績のあるボトムシートライブラリ
- Expo managed workflow 対応、`react-native-reanimated` v3 / `react-native-gesture-handler` との統合が安定
- スナップポイント設定によりハーフ表示・全開を自然に制御できる
- MD3 スタイルへの適用が容易（背景色・角丸をトークンで指定）

**Alternatives considered**:
- `react-native-paper` の `Modal`/`Portal`: ボトムシート専用ではなくアニメーションが弱い
- カスタム実装: MVP には過剰

**必要な peer dependencies**:
```
react-native-reanimated
react-native-gesture-handler
```
両方 Expo SDK 同梱済み（`expo install` で取得可能）

---

## 4. 状態管理

**Decision**: React `useState` + `useReducer`（グローバル状態管理なし）

**Rationale**:
- MVP の状態は「現在地」「店舗一覧」「選択中店舗」「表示モード（地図/リスト）」の 4 つのみ
- すべて単一の Map 画面内で完結するため、グローバルストアは不要
- コンスティテューション原則 IV（シンプルさ）に準拠

**Alternatives considered**:
- `zustand`: 軽量だが MVP 規模では不要。将来必要になったら移行
- `redux-toolkit`: 過剰

---

## 5. データ管理（MVP）

**Decision**: TypeScript 定数ファイル（`src/data/`）によるローカルモックデータ

**Rationale**:
- バックエンド・API なしで即座に開発・テスト可能
- 型定義と同じファイルに置くことでデータとスキーマの乖離を防ぐ
- 将来の API 移行時は `src/services/venueService.ts` を追加するだけで差し替え可能な構造にする

**Data sources (MVP)**:
- 店舗データ: 主要チェーン 5〜10 ブランド × 各 2〜5 店舗（都内想定）をハードコード
- チェーン参考価格: ブランドごとの最安商品名・価格をハードコード
- Wi-Fi 有無: ブランド単位で固定値（全スタバ Wi-Fi あり、など）

---

## 6. ナビゲーション

**Decision**: Expo Router（ファイルベースルーティング）

**Rationale**:
- Expo 公式推奨。`app/` ディレクトリ構造がそのままルーティングになる
- MVP は実質 1 画面（Map 画面）のため、複雑なナビゲーション設定は不要
- 将来の画面追加時にファイルを追加するだけで対応できる

---

## 7. パッケージ管理

**Decision**: npm（Expo デフォルト）

**Rationale**:
- `npx create-expo-app` のデフォルト。チームへの追加セットアップ不要
- Expo の `expo install` コマンドが npm と統合されており、SDK バージョン互換性管理が自動化される

---

## 8. テスト戦略（MVP）

**Decision**: Jest + React Native Testing Library（ユニット・コンポーネントテストのみ）

**Rationale**:
- Expo SDK に標準統合されており、追加設定最小
- テスト対象をビジネスロジック（距離計算・ソート・データフィルタ）とフックに限定
- UI コンポーネントテストは主要ハッピーパスのみ（コンスティテューション原則 II）
- E2E（Maestro）は MVP スコープ外

**テスト優先度**:
1. `utils/distance.ts`（ハーベサイン距離計算）
2. `hooks/useVenues.ts`（半径フィルタ・距離ソート）
3. `components/VenueList`（レンダリング確認）

---

## 9. 距離計算

**Decision**: Haversine 公式をカスタム util として実装（ライブラリなし）

**Rationale**:
- 実装が 10 行以下。外部依存を増やすほどではない
- テスタブルな純粋関数として切り出しやすい
- MVP の精度要件（1km 半径フィルタ）には十分

---

## NEEDS CLARIFICATION: 解決済み

すべて spec.md の Clarifications セクションで解決済み。未解決の技術的 NEEDS CLARIFICATION なし。
