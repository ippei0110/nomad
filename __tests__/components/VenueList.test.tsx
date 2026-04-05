import { render, screen, fireEvent } from '@testing-library/react-native';

import { VenueList } from '../../src/components/VenueList';
import { VenueWithDistance } from '../../src/types/venue';

// react-native-paper のモック
jest.mock('react-native-paper', () => {
  const actual = jest.requireActual('react-native-paper');
  return actual;
});

const makeVenue = (overrides: Partial<VenueWithDistance> = {}): VenueWithDistance => ({
  id: 'venue-1',
  chainId: 'starbucks',
  name: '新宿店',
  address: '東京都新宿区1-1-1',
  location: { latitude: 35.6895, longitude: 139.6917 },
  distanceMeters: 200,
  chain: {
    id: 'starbucks',
    name: 'スターバックス',
    hasWifi: true,
    cheapestItem: { name: 'ドリップコーヒー', priceYen: 330 },
  },
  ...overrides,
});

describe('VenueList', () => {
  it('店舗リストを正しくレンダリングする', () => {
    const venues = [makeVenue(), makeVenue({ id: 'venue-2', name: '渋谷店', distanceMeters: 500 })];
    render(<VenueList venues={venues} onVenuePress={jest.fn()} />);

    expect(screen.getByText(/新宿店/)).toBeTruthy();
    expect(screen.getByText(/渋谷店/)).toBeTruthy();
  });

  it('距離が m 単位で表示される', () => {
    render(<VenueList venues={[makeVenue({ distanceMeters: 350 })]} onVenuePress={jest.fn()} />);

    expect(screen.getByText(/350m/)).toBeTruthy();
  });

  it('最安商品名と価格が表示される', () => {
    render(<VenueList venues={[makeVenue()]} onVenuePress={jest.fn()} />);

    expect(screen.getByText(/ドリップコーヒー/)).toBeTruthy();
    expect(screen.getByText(/¥330/)).toBeTruthy();
  });

  it('空配列のとき EmptyState が表示される', () => {
    render(<VenueList venues={[]} onVenuePress={jest.fn()} />);

    expect(screen.getByText(/近くに対象店舗が見つかりません/)).toBeTruthy();
  });

  it('行タップで onVenuePress が呼ばれる', () => {
    const onVenuePress = jest.fn();
    const venue = makeVenue();
    render(<VenueList venues={[venue]} onVenuePress={onVenuePress} />);

    fireEvent.press(screen.getByText(/新宿店/));

    expect(onVenuePress).toHaveBeenCalledWith(venue);
  });
});
