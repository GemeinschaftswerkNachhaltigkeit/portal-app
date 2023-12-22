import { BestPracticesCategories } from 'src/app/marketplace/models/best-practices-categories';
import { MarketplaceTypes } from 'src/app/marketplace/models/marketplace-type';
import { OfferCategories } from 'src/app/marketplace/models/offer-categories';
import { Contact } from './contact';
import LocationData from './location-data';
import { ThematicFocus } from './thematic-focus';

export type MarketplaceItem = {
  id?: number;
  name?: string;
  description?: string;
  location?: LocationData;
  thematicFocus?: ThematicFocus[];
  contact?: Contact;
  image?: string;
  marketplaceType?: MarketplaceTypes;
  bestPractiseCategory?: BestPracticesCategories;
  offerCategory?: OfferCategories;
  createdAt?: string;
  featured?: boolean;
  featuredText?: string;
  endUntil?: string;
  organisation?: {
    id: number;
    name: string;
    logo: string;
    image: string;
  };
};
