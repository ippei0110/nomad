// ユーザーの現在地。アプリ起動時に 1 度取得し、セッション中は固定で使用する。
export interface UserLocation {
  latitude: number;
  longitude: number;
}

// チェーンブランド。ブランドレベルの情報（Wi-Fi 有無・最安商品）を持つ。
export interface ChainBrand {
  id: string;
  name: string;
  hasWifi: boolean;
  cheapestItem: {
    name: string;
    priceYen: number;
  };
}

// チェーン系カフェ・飲食店の 1 店舗。ChainBrand と紐づく。
export interface Venue {
  id: string;
  chainId: string;
  name: string;
  address: string;
  location: {
    latitude: number;
    longitude: number;
  };
}

// UI 表示用の派生型。現在地からの距離とブランド情報を付加した Venue。
export interface VenueWithDistance extends Venue {
  distanceMeters: number;
  chain: ChainBrand;
}

// 位置情報取得失敗時の理由
export type LocationErrorReason = 'permission_denied' | 'timeout' | 'unavailable';

export interface LocationError {
  reason: LocationErrorReason;
  message: string;
}

// 地図 / 一覧の表示モード
export type ViewMode = 'map' | 'list';

// アプリ全体の UI 状態
export interface AppState {
  location: UserLocation | null;
  locationError: LocationError | null;
  venues: VenueWithDistance[];
  selectedVenue: VenueWithDistance | null;
  viewMode: ViewMode;
  isLoadingLocation: boolean;
}
