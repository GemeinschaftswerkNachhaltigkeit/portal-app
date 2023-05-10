import { PageQuerParams } from 'src/app/shared/models/paging';
import { ThematicFocus } from 'src/app/shared/models/thematic-focus';
import { OrganisationType } from '../../../shared/models/organisation-type';
import { ActivityType } from '../../../shared/models/activity-type';
export type DynamicFilters = {
  [key: string]: string | string[] | number | number[] | boolean;
};
type SearchFilter = PageQuerParams & {
  query?: string;
  location?: string;
  sdgs?: number[];
  thematicFocus?: ThematicFocus[];
  impactAreas?: ThematicFocus[];
  orgaTypes?: OrganisationType[];
  activityTypes?: ActivityType[];
  startDate?: string;
  endDate?: string;
  viewType?: string[];
  envelope?: string;
  initiator?: boolean;
  projectSustainabilityWinner?: boolean;
};

export default SearchFilter;
