# Quickstart: Wi-Fi 付き作業スペース マップ検索

**Branch**: `001-wifi-workspace-map` | **Date**: 2026-03-15

このガイドは実装完了後の動作確認手順です。実装前の参照も可能です。

---

## 前提条件

- Node.js 18 以上
- npm
- Expo Go アプリ（iOS または Android 実機）または iOS/Android シミュレーター
- `npx expo` コマンド（グローバルインストール不要）

---

## セットアップ

```bash
# リポジトリルートで依存関係をインストール
npm install

# ブランチを確認
git branch  # 001-wifi-workspace-map であること
```

---

## 開発サーバー起動

```bash
npx expo start
```

QR コードが表示されたら:
- **iOS 実機**: カメラアプリで QR コードをスキャン → Expo Go で開く
- **Android 実機**: Expo Go アプリで QR コードをスキャン
- **iOS シミュレーター**: `i` キーを押す
- **Android エミュレーター**: `a` キーを押す

---

## 動作確認チェックリスト

### User Story 1: 地図表示（P1）

- [ ] アプリ起動時に位置情報の許可ダイアログが表示される
- [ ] 許可後、現在地を中心とした地図が表示される
- [ ] 半径 1km 以内の店舗にマーカーが表示される
- [ ] マーカーをタップすると店名・最安参考価格のサマリーカードが表示される
- [ ] 許可を拒否した場合、エラーメッセージと設定アプリへの誘導が表示される

### User Story 2: 一覧表示（P2）

- [ ] 「リスト」ボタンをタップすると一覧に切り替わる
- [ ] 店舗が距離の近い順に並んでいる
- [ ] 各行に「店名・距離・最安商品名・参考価格」が表示されている
- [ ] 「地図」ボタンをタップすると地図に戻る

### User Story 3: ボトムシート（P3）

- [ ] 地図のマーカーまたは一覧の行をタップするとボトムシートが開く
- [ ] ボトムシートに「Wi-Fi 有無・最安商品名・参考価格・住所」が表示されている
- [ ] 下にスワイプまたは閉じるボタンでボトムシートが閉じる

### エラー状態

- [ ] 対象エリアに店舗がない場合、「周辺に対象店舗が見つかりません」が表示される
- [ ] オフライン状態でエラーメッセージが表示される（モックデータはオフラインでも表示）

---

## テスト実行

```bash
# ユニット・コンポーネントテスト
npm test

# ウォッチモード
npm test -- --watch

# カバレッジ
npm test -- --coverage
```

---

## ビルド確認（EAS Build）

```bash
# EAS CLI をインストール（未インストールの場合）
npm install -g eas-cli

# iOS プレビュービルド
eas build --platform ios --profile preview

# Android プレビュービルド
eas build --platform android --profile preview
```

---

## トラブルシューティング

| 症状 | 対処 |
|------|------|
| 地図が表示されない | `EXPO_PUBLIC_GOOGLE_MAPS_API_KEY` の設定を確認（Android 実機のみ必要） |
| 位置情報が取得できない | シミュレーターの場合、「Features > Location > Custom Location」でダミー座標を設定 |
| Expo Go でクラッシュ | `npx expo start --clear` でキャッシュクリア後に再起動 |
| ボトムシートが動かない | `react-native-reanimated` の Babel プラグインが `babel.config.js` に追加されているか確認 |
