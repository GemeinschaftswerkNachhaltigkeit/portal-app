import { PageQuerParams } from 'src/app/shared/models/paging';
import { ThematicFocus } from 'src/app/shared/models/thematic-focus';
import { BestPracticesCategories } from './best-practices-categories';
import { OfferCategories } from './offer-categories';

export type SearchFilters = PageQuerParams & {
  query?: string;
  offerCat?: OfferCategories[];
  bestPractiseCat?: BestPracticesCategories[];
  thematicFocus?: ThematicFocus[];
};
