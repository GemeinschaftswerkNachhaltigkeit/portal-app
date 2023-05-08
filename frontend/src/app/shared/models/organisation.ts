import { ThematicFocus } from 'src/app/shared/models/thematic-focus';
import { OrganisationType } from 'src/app/shared/models/organisation-type';
import LocationData from 'src/app/shared/models/location-data';
import { Contact } from 'src/app/shared/models/contact';
import { SocialMediaContact } from 'src/app/shared/models/social-media-contact';
import { OrganisationStatus } from './organisation-status';

type Organisation = {
  id?: number;
  name?: string;
  location?: LocationData;
  sustainableDevelopmentGoals?: number[];
  thematicFocus?: ThematicFocus[];
  organisationType?: OrganisationType[];
  description?: string;
  impactArea?: string;
  logo?: string;
  image?: string;
  contact?: Contact;
  isSubscribed?: boolean;
  socialMediaContacts?: SocialMediaContact[];
  status?: OrganisationStatus;
  modifiedAt?: string;
  initiator?: boolean;
  projectSustainabilityWinner?: boolean;
};

export default Organisation;
