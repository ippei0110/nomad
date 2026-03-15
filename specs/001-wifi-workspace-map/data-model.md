# Data Model: Wi-Fi 付き作業スペース マップ検索

**Branch**: `001-wifi-workspace-map` | **Date**: 2026-03-15

---

## エンティティ定義（TypeScript 型）

### UserLocation

ユーザーの現在地。アプリ起動時に 1 度取得し、セッション中は固定で使用する。

```typescript
interface UserLocation {
  latitude: number;   // 緯度（WGS84）
  longitude: number;  // 経度（WGS84）
}
```

---

### ChainBrand

チェーンブランド。店舗とは独立してブランドレベルの情報を持つ。

```typescript
interface ChainBrand {
  id: string;           // 例: "starbucks", "doutor"
  name: string;         // 表示名 例: "スターバックス"
  hasWifi: boolean;     // Wi-Fi 有無（ブランド全店舗共通）
  cheapestItem: {
    name: string;       // 最安商品名 例: "ショートドリップコーヒー"
    priceYen: number;   // 参考価格（税込・円）
  };
}
```

**バリデーション規則**:
- `id`: 小文字英数字とハイフンのみ。一意。
- `priceYen`: 正の整数のみ。

---

### Venue

チェーン系カフェ・飲食店の 1 店舗。`ChainBrand` と紐づく。

```typescript
interface Venue {
  id: string;          // 例: "starbucks-shinjuku-001"
  chainId: string;     // ChainBrand.id への参照
  name: string;        // 店舗名 例: "スターバックス 新宿南口店"
  address: string;     // 住所 例: "東京都新宿区新宿3-1-1"
  location: {
    latitude: number;
    longitude: number;
  };
}
```

**バリデーション規則**:
- `chainId`: 対応する `ChainBrand.id` が存在すること。
- `id`: 一意。

---

### VenueWithDistance

UI 表示用の派生型。現在地からの距離を付加した `Venue`。

```typescript
interface VenueWithDistance extends Venue {
  distanceMeters: number;  // 現在地からの距離（メートル、整数）
  chain: ChainBrand;       // 結合済みブランド情報
}
```

---

### LocationError

位置情報取得失敗時の状態。

```typescript
type LocationErrorReason =
  | 'permission_denied'
  | 'timeout'
  | 'unavailable';

interface LocationError {
  reason: LocationErrorReason;
  message: string;  // ユーザー向け表示メッセージ
}
```

---

### AppState（UI 状態）

アプリ全体の UI 状態。`useState` で管理。

```typescript
type ViewMode = 'map' | 'list';

interface AppState {
  location: UserLocation | null;
  locationError: LocationError | null;
  venues: VenueWithDistance[];       // 距離フィルタ済み・ソート済み
  selectedVenue: VenueWithDistance | null;  // ボトムシート表示対象
  viewMode: ViewMode;
  isLoadingLocation: boolean;
}
```

---

## エンティティ関係

```
ChainBrand (1) ──< Venue (多)
Venue (1) ──── VenueWithDistance（派生・距離付加）
UserLocation ──── [距離計算] ──── VenueWithDistance.distanceMeters
```

---

## モックデータ構造（MVP）

### chains（`src/data/chains.ts`）

```typescript
const CHAINS: ChainBrand[] = [
  {
    id: 'starbucks',
    name: 'スターバックス',
    hasWifi: true,
    cheapestItem: { name: 'ショートドリップコーヒー', priceYen: 330 },
  },
  {
    id: 'doutor',
    name: 'ドトールコーヒー',
    hasWifi: true,
    cheapestItem: { name: 'ブレンドコーヒー S', priceYen: 220 },
  },
  {
    id: 'tullys',
    name: 'タリーズコーヒー',
    hasWifi: true,
    cheapestItem: { name: 'ドリップコーヒー S', priceYen: 330 },
  },
  {
    id: 'komeda',
    name: 'コメダ珈琲店',
    hasWifi: true,
    cheapestItem: { name: 'ブレンドコーヒー', priceYen: 440 },
  },
  {
    id: 'mcdonalds',
    name: 'マクドナルド',
    hasWifi: true,
    cheapestItem: { name: 'プレミアムローストコーヒー S', priceYen: 170 },
  },
];
```

### venues（`src/data/venues.ts`）

初期データとして東京都内の主要チェーン店を 15〜20 件程度用意する（実装タスクで追加）。

```typescript
const VENUES: Venue[] = [
  {
    id: 'starbucks-shinjuku-001',
    chainId: 'starbucks',
    name: 'スターバックス 新宿サザンテラス店',
    address: '東京都渋谷区代々木2-2-1',
    location: { latitude: 35.6892, longitude: 139.7007 },
  },
  // ... 他の店舗データ
];
```

---

## 状態遷移

### 位置情報取得フロー

```
アプリ起動
  → isLoadingLocation: true
  → 権限リクエスト
    ├── 拒否 → locationError: { reason: 'permission_denied' }
    └── 許可 → getCurrentPosition
              ├── 成功 → location: UserLocation, venues: [フィルタ・ソート済み]
              └── 失敗 → locationError: { reason: 'timeout' | 'unavailable' }
  → isLoadingLocation: false
```

### 店舗選択フロー

```
selectedVenue: null（ボトムシート非表示）
  → ピンまたはリスト行タップ
  → selectedVenue: VenueWithDistance（ボトムシート表示）
  → スワイプダウンまたは閉じる
  → selectedVenue: null
```
