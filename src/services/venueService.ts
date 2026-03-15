import { CHAINS } from '@/data/chains';
import { VENUES } from '@/data/venues';
import { ChainBrand, Venue } from '@/types/venue';

// MVP: ローカル固定データから返す。将来は API 呼び出しに差し替え可能。
export const venueService = {
  getAllVenues(): Venue[] {
    return VENUES;
  },

  getChainById(chainId: string): ChainBrand | undefined {
    return CHAINS.find((chain) => chain.id === chainId);
  },
};
