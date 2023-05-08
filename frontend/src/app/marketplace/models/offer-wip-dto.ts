import { OfferDto } from './offer-dto';

export type OfferWipDto = OfferDto & {
  randomUniqueId?: string;
};
