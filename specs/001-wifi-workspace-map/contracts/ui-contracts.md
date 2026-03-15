# UI Contracts: Wi-Fi 付き作業スペース マップ検索

**Branch**: `001-wifi-workspace-map` | **Date**: 2026-03-15

このファイルは外部 API ではなく、コンポーネント間のインターフェース契約を定義します。
MVP はローカルデータのため HTTP API 契約は存在しません。

---

## コンポーネント Props 契約

### `<MapScreen />` （画面ルート）

画面全体の状態オーナー。子コンポーネントへ状態と操作を渡す。

```typescript
// ルート画面のため Props なし（Expo Router の page コンポーネント）
// 内部で AppState を管理し、子コンポーネントへ渡す
```

**責務**:
- `expo-location` で現在地を取得する
- `useVenues` フックで距離フィルタ・ソートを実行する
- `viewMode` の切り替えを管理する
- `selectedVenue` の選択・解除を管理する

---

### `<VenueMapView />`

地図表示コンポーネント。

```typescript
interface VenueMapViewProps {
  userLocation: UserLocation;
  venues: VenueWithDistance[];
  onVenuePress: (venue: VenueWithDistance) => void;
}
```

**契約**:
- `userLocation` を地図の初期中心座標として使用する。
- `venues` の各要素に対してマーカーを 1 つ描画する。
- マーカータップ時に `onVenuePress` を呼び出す。
- 地図のスクロール・ズームは許可するが、店舗データの再取得は行わない。

---

### `<VenueList />`

店舗一覧コンポーネント。

```typescript
interface VenueListProps {
  venues: VenueWithDistance[];
  onVenuePress: (venue: VenueWithDistance) => void;
}
```

**契約**:
- `venues` を受け取った順（距離昇順）で表示する。ソートは行わない。
- 各行に店名・距離（m 表示）・最安商品名・参考価格を表示する。
- 行タップ時に `onVenuePress` を呼び出す。
- `venues` が空の場合、`<EmptyState />` を表示する。

---

### `<VenueBottomSheet />`

店舗詳細ボトムシート。

```typescript
interface VenueBottomSheetProps {
  venue: VenueWithDistance | null;
  onClose: () => void;
}
```

**契約**:
- `venue` が `null` のときボトムシートは閉じた状態（`snapPoint: 0`）にある。
- `venue` が非 `null` のときボトムシートを開く（`snapPoint: 40%` 程度）。
- ボトムシート内に表示する情報:
  - ブランド名 + 店舗名
  - Wi-Fi 有無（`Chip` コンポーネントで「Wi-Fi あり」/「Wi-Fi なし」）
  - 最安商品名と参考価格（税込）
  - 住所
- スワイプダウンまたは閉じるボタン操作で `onClose` を呼び出す。
- `cheapestItem` が存在しない場合、価格欄に「価格情報なし」を表示する。

---

### `<ViewModeToggle />`

地図/リスト切り替えボタン。

```typescript
interface ViewModeToggleProps {
  mode: ViewMode;
  onChange: (mode: ViewMode) => void;
}
```

**契約**:
- 現在の `mode` に対応するボタンをアクティブ状態で表示する。
- タップ時に `onChange` を呼び出す。

---

### `<EmptyState />`

空状態・エラー状態の表示。

```typescript
interface EmptyStateProps {
  type: 'no_venues' | 'location_error' | 'offline';
  onRetry?: () => void;  // 再試行ボタン表示（type に応じてオプション）
}
```

**契約**:
- `type` に応じたメッセージとアイコンを表示する。
- `type === 'location_error'` の場合、端末設定アプリへのリンクボタンを表示する。
- `onRetry` が渡された場合、再試行ボタンを表示する。

---

## フック契約

### `useLocation()`

```typescript
interface UseLocationReturn {
  location: UserLocation | null;
  error: LocationError | null;
  isLoading: boolean;
}

function useLocation(): UseLocationReturn;
```

**契約**:
- マウント時に位置情報取得を開始する。
- 権限拒否時は `error.reason === 'permission_denied'`。
- 取得成功まで `isLoading === true`。
- 再取得機能は MVP スコープ外。

---

### `useVenues(location, radiusMeters?)`

```typescript
function useVenues(
  location: UserLocation | null,
  radiusMeters?: number  // デフォルト: 1000
): VenueWithDistance[];
```

**契約**:
- `location` が `null` の場合、空配列を返す。
- `radiusMeters` 以内の店舗のみ返す（デフォルト 1000m）。
- 返り値は距離の昇順でソートされている。
- 距離計算は Haversine 公式を使用する。

---

## データサービス契約

### `venueService`（MVP: ローカルデータ）

```typescript
interface VenueService {
  getAllVenues(): Venue[];
  getChainById(chainId: string): ChainBrand | undefined;
}
```

**契約**:
- MVP では `src/data/venues.ts` と `src/data/chains.ts` からデータを返す。
- 将来の API 移行時はこのインターフェースを実装するサービスに差し替える。
- 非同期対応（`Promise`）は将来の移行に備えて検討するが、MVP では同期で可。
