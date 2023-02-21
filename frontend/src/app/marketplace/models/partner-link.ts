import { BestPracticesCategories } from './best-practices-categories';
import { OfferCategories } from './offer-categories';

export type PartnerLink = {
  id: number;
  title: string;
  logo: string;
  url: string;
  category: OfferCategories | BestPracticesCategories;
};
