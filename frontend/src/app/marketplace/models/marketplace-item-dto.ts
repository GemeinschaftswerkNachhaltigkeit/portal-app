import { Contact } from 'src/app/shared/models/contact';
import LocationData from 'src/app/shared/models/location-data';
import { ThematicFocus } from 'src/app/shared/models/thematic-focus';
import { BestPracticesCategories } from './best-practices-categories';
import { MarketplaceTypes } from './marketplace-type';
import { OfferCategories } from './offer-categories';

export type MarketplaceItemDto = {
  id?: number;
  name: string;
  description: string;
  location: LocationData;
  thematicFocus: ThematicFocus[];
  contact: Contact;
  image: string;
  marketplaceType: MarketplaceTypes;
  bestPractiseCategory?: BestPracticesCategories;
  offerCategory?: OfferCategories;
  createdAt?: string;
  featured?: boolean;
  featuredText?: string;
  endUntil?: string;
  organisation: {
    id: number;
    name: string;
    logo: string;
    image: string;
  };
};
