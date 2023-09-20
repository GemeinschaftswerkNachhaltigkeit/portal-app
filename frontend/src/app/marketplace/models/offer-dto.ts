import { Contact } from 'src/app/shared/models/contact';
import LocationData from 'src/app/shared/models/location-data';
import { ThematicFocus } from 'src/app/shared/models/thematic-focus';
import { OfferCategories } from './offer-categories';
import { Status } from './status';

export type OfferDto = {
  id?: number;
  name: string;
  description: string;
  offerCategory: OfferCategories;
  location?: LocationData;
  thematicFocus: ThematicFocus[];
  contact: Contact;
  image?: string;
  status?: Status;
  featured?: boolean;
  featuredText?: string;
  endUntil?: string;
};
