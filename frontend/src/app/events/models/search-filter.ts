import { PageQuerParams } from 'src/app/shared/models/paging';
import { ThematicFocus } from 'src/app/shared/models/thematic-focus';

export type DynamicFilters = {
  [key: string]: string | string[] | number | number[] | boolean;
};
type SearchFilter = PageQuerParams & {
  query?: string;
  location?: string;
  thematicFocus?: ThematicFocus[];
  startDate?: string;
  endDate?: string;
  online?: boolean;
  permanent?: boolean;
  onlyDan?: boolean;
};

export default SearchFilter;
