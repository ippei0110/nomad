import { ChainBrand } from '@/types/venue';

export const CHAINS: ChainBrand[] = [
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
