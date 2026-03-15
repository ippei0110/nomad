import { renderHook } from '@testing-library/react-native';

import { useVenues } from '../../src/hooks/useVenues';
import { UserLocation } from '../../src/types/venue';

// 新宿付近の座標
const ORIGIN: UserLocation = { latitude: 35.6895, longitude: 139.6917 };

// venueService をモック
jest.mock('../../src/services/venueService', () => ({
  venueService: {
    getAllVenues: jest.fn(() => [
      {
        id: 'venue-near',
        chainId: 'starbucks',
        name: '近い店舗（同座標）',
        address: '東京都新宿区テスト1-1',
        location: { latitude: 35.6895, longitude: 139.6917 }, // 0m
      },
      {
        id: 'venue-far',
        chainId: 'doutor',
        name: '遠い店舗（約 4.4km）',
        address: '東京都渋谷区テスト2-2',
        location: { latitude: 35.6500, longitude: 139.6917 }, // ~4.4km
      },
      {
        id: 'venue-mid',
        chainId: 'tullys',
        name: '中間の店舗（約 500m）',
        address: '東京都新宿区テスト3-3',
        location: { latitude: 35.6895 + 0.0045, longitude: 139.6917 }, // ~500m
      },
    ]),
    getChainById: jest.fn((id: string) => ({
      id,
      name: id,
      hasWifi: true,
      cheapestItem: { name: 'コーヒー', priceYen: 300 },
    })),
  },
}));

describe('useVenues', () => {
  it('location が null のとき空配列を返す', () => {
    const { result } = renderHook(() => useVenues(null));
    expect(result.current).toEqual([]);
  });

  it('デフォルト半径 1000m 以内の店舗のみ返す', () => {
    const { result } = renderHook(() => useVenues(ORIGIN));
    // venue-near (0m) と venue-mid (~500m) は含まれる
    // venue-far (~4400m) は除外される
    const ids = result.current.map((v) => v.id);
    expect(ids).toContain('venue-near');
    expect(ids).toContain('venue-mid');
    expect(ids).not.toContain('venue-far');
  });

  it('radiusMeters を広げると遠い店舗も含まれる', () => {
    const { result } = renderHook(() => useVenues(ORIGIN, 10000));
    expect(result.current).toHaveLength(3);
  });

  it('返り値が distanceMeters の昇順でソートされている', () => {
    const { result } = renderHook(() => useVenues(ORIGIN, 10000));
    const distances = result.current.map((v) => v.distanceMeters);
    expect(distances).toEqual([...distances].sort((a, b) => a - b));
  });

  it('各店舗に chain 情報が結合されている', () => {
    const { result } = renderHook(() => useVenues(ORIGIN));
    expect(result.current[0].chain).toBeDefined();
    expect(result.current[0].chain.hasWifi).toBe(true);
  });

  it('chainId に対応する chain が見つからない店舗は除外される', () => {
    const { venueService } = require('../../src/services/venueService');
    venueService.getChainById.mockReturnValueOnce(undefined);
    const { result } = renderHook(() => useVenues(ORIGIN));
    // venue-near の chain が undefined → 除外される → venue-mid のみ残る
    expect(result.current.every((v) => v.chain !== undefined)).toBe(true);
  });
});
