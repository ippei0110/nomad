import { Venue } from '@/types/venue';

// 東京都内の主要チェーン店舗データ（MVP 固定データ）
export const VENUES: Venue[] = [
  // ── スターバックス ─────────────────────────────
  {
    id: 'starbucks-shinjuku-001',
    chainId: 'starbucks',
    name: 'スターバックス 新宿サザンテラス店',
    address: '東京都渋谷区代々木2-2-1',
    location: { latitude: 35.6892, longitude: 139.7007 },
  },
  {
    id: 'starbucks-shibuya-001',
    chainId: 'starbucks',
    name: 'スターバックス 渋谷スクランブルスクエア店',
    address: '東京都渋谷区渋谷2-24-12',
    location: { latitude: 35.6584, longitude: 139.7022 },
  },
  {
    id: 'starbucks-harajuku-001',
    chainId: 'starbucks',
    name: 'スターバックス 表参道ヒルズ店',
    address: '東京都渋谷区神宮前4-12-10',
    location: { latitude: 35.6653, longitude: 139.7095 },
  },
  {
    id: 'starbucks-ginza-001',
    chainId: 'starbucks',
    name: 'スターバックス 銀座マロニエゲート店',
    address: '東京都中央区銀座2-2-14',
    location: { latitude: 35.6728, longitude: 139.7653 },
  },

  // ── ドトールコーヒー ────────────────────────────
  {
    id: 'doutor-shinjuku-001',
    chainId: 'doutor',
    name: 'ドトールコーヒー 新宿西口店',
    address: '東京都新宿区西新宿1-1-3',
    location: { latitude: 35.6908, longitude: 139.6994 },
  },
  {
    id: 'doutor-shibuya-001',
    chainId: 'doutor',
    name: 'ドトールコーヒー 渋谷道玄坂店',
    address: '東京都渋谷区道玄坂1-6-4',
    location: { latitude: 35.6598, longitude: 139.6982 },
  },
  {
    id: 'doutor-akihabara-001',
    chainId: 'doutor',
    name: 'ドトールコーヒー 秋葉原昭和通り口店',
    address: '東京都千代田区外神田1-1-5',
    location: { latitude: 35.6986, longitude: 139.7731 },
  },
  {
    id: 'doutor-ikebukuro-001',
    chainId: 'doutor',
    name: 'ドトールコーヒー 池袋東口店',
    address: '東京都豊島区東池袋1-2-3',
    location: { latitude: 35.7299, longitude: 139.7124 },
  },

  // ── タリーズコーヒー ────────────────────────────
  {
    id: 'tullys-shinjuku-001',
    chainId: 'tullys',
    name: 'タリーズコーヒー 新宿三丁目店',
    address: '東京都新宿区新宿3-19-1',
    location: { latitude: 35.6884, longitude: 139.7055 },
  },
  {
    id: 'tullys-marunouchi-001',
    chainId: 'tullys',
    name: 'タリーズコーヒー 丸の内店',
    address: '東京都千代田区丸の内1-6-4',
    location: { latitude: 35.6817, longitude: 139.7643 },
  },
  {
    id: 'tullys-omotesando-001',
    chainId: 'tullys',
    name: 'タリーズコーヒー 表参道店',
    address: '東京都港区南青山3-18-19',
    location: { latitude: 35.6659, longitude: 139.7116 },
  },

  // ── コメダ珈琲店 ────────────────────────────────
  {
    id: 'komeda-shinjuku-001',
    chainId: 'komeda',
    name: 'コメダ珈琲店 新宿西口店',
    address: '東京都新宿区西新宿1-12-1',
    location: { latitude: 35.6919, longitude: 139.6977 },
  },
  {
    id: 'komeda-shibuya-001',
    chainId: 'komeda',
    name: 'コメダ珈琲店 渋谷店',
    address: '東京都渋谷区宇田川町20-11',
    location: { latitude: 35.6620, longitude: 139.6986 },
  },
  {
    id: 'komeda-ikebukuro-001',
    chainId: 'komeda',
    name: 'コメダ珈琲店 池袋西口店',
    address: '東京都豊島区西池袋1-11-1',
    location: { latitude: 35.7315, longitude: 139.7088 },
  },

  // ── マクドナルド ────────────────────────────────
  {
    id: 'mcdonalds-shinjuku-001',
    chainId: 'mcdonalds',
    name: 'マクドナルド 新宿東口店',
    address: '東京都新宿区新宿3-30-11',
    location: { latitude: 35.6896, longitude: 139.7069 },
  },
  {
    id: 'mcdonalds-shibuya-001',
    chainId: 'mcdonalds',
    name: 'マクドナルド 渋谷マークシティ店',
    address: '東京都渋谷区道玄坂1-12-1',
    location: { latitude: 35.6580, longitude: 139.6976 },
  },
  {
    id: 'mcdonalds-akihabara-001',
    chainId: 'mcdonalds',
    name: 'マクドナルド 秋葉原電気街口店',
    address: '東京都千代田区外神田1-8-2',
    location: { latitude: 35.6992, longitude: 139.7716 },
  },
  {
    id: 'mcdonalds-ueno-001',
    chainId: 'mcdonalds',
    name: 'マクドナルド 上野広小路店',
    address: '東京都台東区上野3-19-6',
    location: { latitude: 35.7090, longitude: 139.7745 },
  },
];
