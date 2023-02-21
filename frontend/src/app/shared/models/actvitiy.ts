import { ThematicFocus } from 'src/app/shared/models/thematic-focus';
import LocationData from 'src/app/shared/models/location-data';
import { Contact } from 'src/app/shared/models/contact';
import { SocialMediaContact } from 'src/app/shared/models/social-media-contact';
import { ActivityType } from './activity-type';

type Activity = {
  id?: number;
  name?: string;
  location?: LocationData;
  sustainableDevelopmentGoals?: number[];
  thematicFocus?: ThematicFocus[];
  activityType?: ActivityType;
  description?: string;
  impactArea?: string;
  logo?: string;
  image?: string;
  contact?: Contact;
  socialMediaContacts?: SocialMediaContact[];

  period?: {
    start: string;
    end: string;
    permanent?: boolean;
  };
  organisation?: {
    id: number;
    name: string;
    logo: string;
    image: string;
  };
  isSubscribed?: boolean;
};

export default Activity;
