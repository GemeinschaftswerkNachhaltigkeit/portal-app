import { ActivityType } from './activity-type';
import { OrganisationType } from './organisation-type';

type Type = {
  activityType?: ActivityType | null;
  organisationType?: OrganisationType | null;
  resultType?: string;
};

export default Type;
