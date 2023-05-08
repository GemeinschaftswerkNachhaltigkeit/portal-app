import { Contact } from 'src/app/shared/models/contact';
import LocationData from 'src/app/shared/models/location-data';
import { ThematicFocus } from 'src/app/shared/models/thematic-focus';
import { BestPracticesCategories } from './best-practices-categories';
import { Status } from './status';

export type BestPracticesDto = {
  id?: number;
  name: string;
  description: string;
  bestPractiseCategory: BestPracticesCategories;
  location?: LocationData;
  thematicFocus: ThematicFocus[];
  contact: Contact;
  image?: string;
  status?: Status;
};
