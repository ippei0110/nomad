---
description: "Task list for Wi-Fi 付き作業スペース マップ検索"
---

# Tasks: Wi-Fi 付き作業スペース マップ検索

**Input**: Design documents from `/specs/001-wifi-workspace-map/`
**Prerequisites**: plan.md ✅, spec.md ✅, data-model.md ✅, contracts/ui-contracts.md ✅, research.md ✅

**Tests**: コンスティテューション原則 II（実践的テスト）に従い、重要ビジネスロジックとフックに絞ってテストを生成します。UI レイアウト細部・ボイラープレート画面のテストは省略します。

**Organization**: タスクはユーザーストーリー単位で編成し、各ストーリーを独立して実装・確認できるようにします。

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: 並列実行可能（別ファイル・依存関係なし）
- **[Story]**: 対応するユーザーストーリー（US1, US2, US3）
- 各タスクに正確なファイルパスを記載

---

## Phase 1: Setup（プロジェクト初期化）

**目的**: Expo プロジェクトを作成し、依存パッケージと開発環境を整える

- [x] T001 `npx create-expo-app@latest nomad --template blank-typescript` でプロジェクトを初期化し、不要なボイラープレートファイルを削除する
- [x] T002 `expo install react-native-maps expo-location @gorhom/bottom-sheet react-native-paper react-native-reanimated react-native-gesture-handler` で依存パッケージをインストールする
- [x] T003 [P] `tsconfig.json` の `strict: true` を確認し、`paths` に `@/*: ["src/*"]` エイリアスを追加する
- [x] T004 [P] `.eslintrc.js` と `.prettierrc` を Expo デフォルト設定で作成し、`package.json` に `lint` スクリプトを追加する

---

## Phase 2: Foundational（全ストーリー共通の基盤）

**目的**: 全ユーザーストーリーが依存する型定義・データ・ユーティリティを完成させる

**⚠️ CRITICAL**: このフェーズが完了するまでユーザーストーリーの実装を開始しない

- [x] T005 `src/types/venue.ts` に data-model.md の全型定義を実装する（`UserLocation`, `ChainBrand`, `Venue`, `VenueWithDistance`, `LocationError`, `LocationErrorReason`, `AppState`, `ViewMode`）
- [x] T006 [P] `src/data/chains.ts` に data-model.md のチェーンブランド固定データを実装する（スターバックス・ドトール・タリーズ・コメダ・マクドナルド の 5 チェーン）
- [x] T007 [P] `src/data/venues.ts` に東京都内の主要チェーン店舗モックデータを 15〜20 件実装する（各チェーン 3〜4 店舗、緯度経度は実在の座標を使用）
- [x] T008 `src/utils/distance.ts` に Haversine 公式による距離計算関数 `calcDistanceMeters(from: UserLocation, to: UserLocation): number` を実装する
- [x] T009 [P] `__tests__/utils/distance.test.ts` に距離計算のユニットテストを実装する（既知の 2 点間距離で検証・同一座標は 0m・1km 境界値テスト）
- [x] T010 `src/services/venueService.ts` に `getAllVenues(): Venue[]` と `getChainById(chainId: string): ChainBrand | undefined` を実装する（MVP: `src/data/` から同期取得）
- [x] T011 `src/components/EmptyState.tsx` を実装する（`type: 'no_venues' | 'location_error' | 'offline'` に応じたメッセージ・アイコン・設定アプリ誘導ボタンを react-native-paper で表示）
- [x] T012 `app/_layout.tsx` に `GestureHandlerRootView`, `PaperProvider`（MD3 テーマ）, `BottomSheetModalProvider` を設定し、Reanimated の Babel プラグインが `babel.config.js` に含まれていることを確認する

**Checkpoint**: 型・データ・ユーティリティがすべて揃い、ユーザーストーリーの実装を開始できる状態

---

## Phase 3: User Story 1 - 地図で近くの作業スペースを探す（Priority: P1）🎯 MVP

**Goal**: アプリ起動 → 位置情報許可 → 現在地中心の地図 → 半径 1km 内の店舗ピン表示 → ピンタップでサマリーカード表示

**Independent Test**: 位置情報を許可した状態で起動し、地図上に店舗ピンが表示され、ピンをタップするとサマリーカード（店名・最安商品名・参考価格）が確認できれば US1 完成

### Implementation for User Story 1

- [x] T013 [US1] `src/hooks/useLocation.ts` を実装する（`expo-location` で権限リクエスト → `getCurrentPositionAsync` → `{ location, error, isLoading }` を返す。`permission_denied` / `timeout` / `unavailable` を `LocationError` にマッピング）
- [x] T014 [P] [US1] `__tests__/hooks/useVenues.test.ts` に `useVenues` のユニットテストを実装する（`location: null` → 空配列・半径外の店舗を除外・距離昇順ソート・デフォルト 1000m 半径）
- [x] T015 [US1] `src/hooks/useVenues.ts` を実装する（`venueService.getAllVenues()` を取得し、`calcDistanceMeters` で半径 1000m フィルタ・距離昇順ソート・`chain` を結合した `VenueWithDistance[]` を返す）
- [x] T016 [US1] `src/components/VenueMapView.tsx` を実装する（`react-native-maps` の `MapView` に `userLocation` を初期中心座標として設定し、`venues` 各要素に `Marker` を配置、`Callout` に店名・最安商品名・参考価格のサマリーカードを表示、マーカータップで `onVenuePress` を呼び出す）
- [x] T017 [US1] `app/index.tsx` にマップ画面（MapScreen）を実装する（`useLocation` と `useVenues` を呼び出し、ローディング中は `ActivityIndicator`、`locationError` 時は `<EmptyState type="location_error" />`、店舗 0 件時は `<EmptyState type="no_venues" />`、正常時は `<VenueMapView>` を表示）

**Checkpoint**: この時点で US1 が単独で動作・確認できる状態（地図表示・マーカー・サマリーカード）

---

## Phase 4: User Story 2 - 一覧で店舗を比較する（Priority: P2）

**Goal**: 地図/リスト切り替えボタンで一覧に切り替え、距離順に並んだ店舗リストで最安参考価格を比較できる

**Independent Test**: リスト表示に切り替えた際に店舗が距離昇順で表示され、各行に「店名・距離・最安商品名・参考価格」が確認できれば US2 完成

### Implementation for User Story 2

- [ ] T018 [US2] `src/components/VenueList.tsx` を実装する（`FlatList` で `venues` を表示。各行に店名・`${distanceMeters}m`・最安商品名・`¥${priceYen}` を react-native-paper の `List.Item` で表示、行タップで `onVenuePress`、空配列時に `<EmptyState type="no_venues" />` を表示）
- [ ] T019 [P] [US2] `__tests__/components/VenueList.test.tsx` に VenueList のコンポーネントテストを実装する（店舗リストが正しくレンダリングされる・距離が m 単位で表示される・空配列で EmptyState が表示される・行タップで onVenuePress が呼ばれる）
- [ ] T020 [US2] `src/components/ViewModeToggle.tsx` を実装する（react-native-paper の `SegmentedButtons` を使い、`mode` が `'map'` / `'list'` のどちらかをアクティブ状態で表示、タップで `onChange` を呼び出す）
- [ ] T021 [US2] `app/index.tsx` に `viewMode` state（初期値 `'map'`）を追加し、`<ViewModeToggle>` を画面上部に配置、`viewMode === 'list'` のとき `<VenueList>` を表示、`viewMode === 'map'` のとき `<VenueMapView>` を表示するよう更新する

**Checkpoint**: この時点で US1（地図）と US2（一覧）が独立して動作する状態

---

## Phase 5: User Story 3 - ボトムシートで作業可否と価格を確認する（Priority: P3）

**Goal**: 地図マーカーまたは一覧行をタップするとボトムシートが開き、Wi-Fi 有無・最安商品名・参考価格・住所を確認できる

**Independent Test**: 地図または一覧から店舗をタップしてボトムシートが開き、「Wi-Fi 有無・最安商品名・参考価格・住所」の 3 点が表示されれば US3 完成

### Implementation for User Story 3

- [ ] T022 [US3] `src/components/VenueBottomSheet.tsx` を実装する（`@gorhom/bottom-sheet` の `BottomSheet` コンポーネントを使用。`venue` が非 `null` のとき snapPoint 40% で開く・閉じたとき `onClose` を呼び出す。コンテンツ: ブランド名+店舗名・Wi-Fi 有無を `Chip`（「Wi-Fi あり」緑 / 「Wi-Fi なし」グレー）・最安商品名と `¥${priceYen}`（未設定時は「価格情報なし」）・住所を react-native-paper で表示）
- [ ] T023 [US3] `app/index.tsx` に `selectedVenue` state（初期値 `null`）を追加し、`<VenueBottomSheet venue={selectedVenue} onClose={() => setSelectedVenue(null)} />` を追加、`VenueMapView` と `VenueList` の `onVenuePress` ハンドラで `setSelectedVenue(venue)` を呼び出すよう更新する

**Checkpoint**: 全ユーザーストーリー（地図・一覧・ボトムシート）が独立して機能する状態

---

## Phase N: Polish & Cross-Cutting Concerns

**目的**: 仕上げ・横断的な品質確認

- [ ] T024 [P] `quickstart.md` の動作確認チェックリストに従い、iOS シミュレーターで US1〜US3 の全受け入れシナリオを手動確認する
- [ ] T025 [P] `npm test` を実行してテストが全件パスすることを確認する（distance.test.ts・useVenues.test.ts・VenueList.test.tsx）
- [ ] T026 [P] `npm run lint` を実行してエラーがないことを確認し、残存する警告を修正する

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: 依存なし — 即座に開始可能
- **Foundational (Phase 2)**: Phase 1 完了後 — 全ユーザーストーリーをブロック
- **US1 (Phase 3)**: Phase 2 完了後 — 他ストーリーに依存しない
- **US2 (Phase 4)**: Phase 2 完了後。Phase 3（T017）の `app/index.tsx` を更新するため Phase 3 後が自然
- **US3 (Phase 5)**: Phase 2 完了後。Phase 4 後の `app/index.tsx` に追記するため Phase 4 後が自然
- **Polish (Phase N)**: 全ストーリー完了後

### User Story Dependencies

- **US1 (P1)**: Phase 2 完了後、即座に開始可能
- **US2 (P2)**: Phase 2 完了後。`app/index.tsx` を US1 の T017 に追記するため US1 完了後が望ましい
- **US3 (P3)**: Phase 2 完了後。`app/index.tsx` を US2 の T021 に追記するため US2 完了後が望ましい

### Within Each User Story

- T014（useVenues テスト）→ T015（useVenues 実装）の順に進める（テストを先に書くことを推奨）
- T015（useVenues）完了後 → T016（VenueMapView）実装
- T016 完了後 → T017（MapScreen 統合）
- T018（VenueList）→ T019（VenueList テスト）は並列可
- T020（ViewModeToggle）→ T021（統合）は順次
- T022（VenueBottomSheet）→ T023（統合）は順次

### Parallel Opportunities

```bash
# Phase 2 の並列実行例
Task: "T006 src/data/chains.ts を実装"
Task: "T007 src/data/venues.ts を実装"
Task: "T009 __tests__/utils/distance.test.ts を実装"

# US1 の並列実行例（T013, T015 完了後）
Task: "T014 __tests__/hooks/useVenues.test.ts を実装"
Task: "T016 src/components/VenueMapView.tsx を実装"

# US2 の並列実行例（T018 完了後）
Task: "T019 __tests__/components/VenueList.test.tsx を実装"
Task: "T020 src/components/ViewModeToggle.tsx を実装"
```

---

## Implementation Strategy

### MVP First（US1 のみで完結）

1. Phase 1: Setup 完了
2. Phase 2: Foundational 完了（⚠️ 全ストーリーをブロック）
3. Phase 3: US1 完了
4. **STOP & VALIDATE**: iOS シミュレーターで地図・マーカー・サマリーカードを手動確認
5. 動作確認 OK → 次のストーリーへ

### Incremental Delivery

1. Setup + Foundational → 基盤完成
2. US1（地図表示）→ 単独動作確認 → **MVP 達成**
3. US2（一覧表示）→ 単独動作確認 → デモ可能
4. US3（ボトムシート）→ 単独動作確認 → フル機能完成
5. Polish → リリース準備

---

## Notes

- `[P]` タスクは別ファイル対象・依存なしで並列実行可能
- `[US*]` ラベルはユーザーストーリーへのトレーサビリティ
- テストは T009（distance）・T014（useVenues）・T019（VenueList）の 3 件のみ。UI レイアウト細部はスキップ
- 各フェーズの Checkpoint で必ず実機/シミュレーター確認を行う
- `app/index.tsx` は US1 → US2 → US3 と段階的に拡張するため、各ストーリーで上書きではなく追記・更新する
