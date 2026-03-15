# Implementation Plan: Wi-Fi 付き作業スペース マップ検索

**Branch**: `001-wifi-workspace-map` | **Date**: 2026-03-15 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-wifi-workspace-map/spec.md`

---

## Summary

現在地周辺の Wi-Fi 付き主要チェーン系店舗を地図と一覧で探し、ボトムシートで詳細（Wi-Fi 有無・最安参考価格・住所）を確認できる React Native + Expo アプリの MVP。店舗データは MVP ではローカルの固定モックデータを使用し、Haversine 距離計算で半径 1km の店舗をフィルタリングする。

---

## Technical Context

**Language/Version**: TypeScript 5.x（strict モード）/ Node.js 18+
**Primary Dependencies**:
- `expo` SDK（managed workflow）
- `react-native-maps`（地図・マーカー）
- `expo-location`（現在地取得）
- `@gorhom/bottom-sheet` v5（ボトムシート）
- `react-native-paper` v5+（MD3 UI コンポーネント）
- `expo-router`（ファイルベースルーティング）
- `react-native-reanimated` / `react-native-gesture-handler`（ボトムシート peer deps）

**Storage**: N/A（MVP はローカル定数データ）
**Testing**: Jest + React Native Testing Library
**Target Platform**: iOS 16+ / Android 10+（開発: Expo Go / 配布: EAS Build）
**Project Type**: mobile-app
**Performance Goals**: 起動から地図表示まで 3 秒以内 / ボトムシート表示 0.5 秒以内
**Constraints**: オフライン時もモックデータは表示可能（位置情報のみ要ネットワーク許可）
**Scale/Scope**: 単一開発者・MVP。店舗データ 20 件程度・画面 1 枚（地図/リスト切り替え）

---

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| 原則 | チェック | 判定 |
|------|---------|------|
| I. 仕様先行 | spec.md・clarifications・data-model すべて完成 | ✅ |
| II. 実践的テスト | 距離計算・useVenues フックのユニットテスト + VenueList コンポーネントテストを計画。UI レイアウト細部はスキップ | ✅ |
| III. 小さく独立した実装 | P1（地図）→ P2（一覧）→ P3（ボトムシート）が独立して動作・確認可能 | ✅ |
| IV. シンプルさ | ローカルデータ・useState のみ・グローバルストアなし。抽象レイヤーは venueService のみ（将来の API 差し替え口） | ✅ |
| V. UI 一貫性（MD3） | react-native-paper v5 使用。ハードコードデザイン値なし | ✅ |

**Constitution Check: PASS** — 複雑性トラッキングの記録なし

---

## Project Structure

### Documentation (this feature)

```text
specs/001-wifi-workspace-map/
├── plan.md           ✅ このファイル
├── research.md       ✅ 技術選定の根拠
├── data-model.md     ✅ 型定義・エンティティ関係
├── quickstart.md     ✅ 動作確認手順
├── contracts/
│   └── ui-contracts.md   ✅ コンポーネント Props 契約・フック契約
└── tasks.md          （/speckit.tasks で生成）
```

### Source Code (repository root)

```text
app/
├── _layout.tsx              # Expo Router ルートレイアウト（PaperProvider, GestureHandlerRootView）
└── index.tsx                # マップ画面（MapScreen）

src/
├── components/
│   ├── VenueMapView.tsx      # react-native-maps 地図 + マーカー
│   ├── VenueList.tsx         # 店舗一覧（FlatList）
│   ├── VenueBottomSheet.tsx  # @gorhom/bottom-sheet 店舗詳細
│   ├── ViewModeToggle.tsx    # 地図/リスト切り替えボタン
│   └── EmptyState.tsx        # 空状態・エラー状態
├── data/
│   ├── chains.ts             # ChainBrand[] 固定データ
│   └── venues.ts             # Venue[] 固定モックデータ
├── hooks/
│   ├── useLocation.ts        # expo-location ラッパー
│   └── useVenues.ts          # 距離フィルタ・ソートロジック
├── services/
│   └── venueService.ts       # データアクセス抽象（MVP: ローカル）
├── types/
│   └── venue.ts              # 全型定義（Venue, ChainBrand, AppState 等）
└── utils/
    └── distance.ts           # Haversine 距離計算

__tests__/
├── utils/
│   └── distance.test.ts      # 距離計算ユニットテスト
├── hooks/
│   └── useVenues.test.ts     # フィルタ・ソートテスト
└── components/
    └── VenueList.test.tsx    # 一覧レンダリングテスト
```

**Structure Decision**: 単一モバイルアプリ。`app/` は Expo Router のルーティング専用（画面定義のみ）、ビジネスロジックは `src/` に集約。MVP は `app/index.tsx` 1 画面のみ。

---

## Complexity Tracking

> Constitution Check が PASS のため記録なし。
