import { calcDistanceMeters } from '../../src/utils/distance';

describe('calcDistanceMeters', () => {
  it('同一座標の距離は 0m', () => {
    const point = { latitude: 35.6895, longitude: 139.6917 };
    expect(calcDistanceMeters(point, point)).toBe(0);
  });

  it('新宿〜渋谷間の距離が 3〜5km の範囲に収まる', () => {
    const shinjuku = { latitude: 35.6895, longitude: 139.6917 };
    const shibuya = { latitude: 35.658, longitude: 139.7016 };
    const dist = calcDistanceMeters(shinjuku, shibuya);
    expect(dist).toBeGreaterThan(3000);
    expect(dist).toBeLessThan(5000);
  });

  it('南北に ~500m 離れた点は 1000m 未満', () => {
    // 緯度 1 度 ≈ 111,000m → 0.0045 度 ≈ 500m
    const origin = { latitude: 35.6895, longitude: 139.6917 };
    const nearby = { latitude: 35.6895 + 0.0045, longitude: 139.6917 };
    expect(calcDistanceMeters(origin, nearby)).toBeLessThan(1000);
  });

  it('南北に ~1.5km 離れた点は 1000m 超', () => {
    // 0.0135 度 ≈ 1500m
    const origin = { latitude: 35.6895, longitude: 139.6917 };
    const farPoint = { latitude: 35.6895 + 0.0135, longitude: 139.6917 };
    expect(calcDistanceMeters(origin, farPoint)).toBeGreaterThan(1000);
  });

  it('対称性: A→B と B→A の距離は等しい', () => {
    const a = { latitude: 35.6895, longitude: 139.6917 };
    const b = { latitude: 35.6584, longitude: 139.7022 };
    expect(calcDistanceMeters(a, b)).toBe(calcDistanceMeters(b, a));
  });
});
