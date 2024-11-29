import { ThematicFocus } from 'src/app/shared/models/thematic-focus';
import LocationData from 'src/app/shared/models/location-data';
import { Contact } from 'src/app/shared/models/contact';
import { SocialMediaContact } from 'src/app/shared/models/social-media-contact';
import { ActivityType } from './activity-type';
import { SpecialActivityType } from './special-activity-type';
import { ImageMode } from '../components/form/upload-image/upload-image.component';

type Activity = {
  id?: number;
  name?: string;
  location?: LocationData;
  sustainableDevelopmentGoals?: number[];
  thematicFocus?: ThematicFocus[];
  activityType?: ActivityType;
  specialType?: SpecialActivityType;
  description?: string;
  impactArea?: string;
  logo?: string;
  image?: string;
  contact?: Contact;
  socialMediaContacts?: SocialMediaContact[];
  bannerImageMode?: ImageMode;

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
  registerUrl?: string;
};

export default Activity;
