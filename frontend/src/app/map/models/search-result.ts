import Organisation from 'src/app/shared/models/organisation';
import Activity from 'src/app/shared/models/actvitiy';
import { MarketplaceItem } from 'src/app/shared/models/marketplaceItem';
export type SearchResultResponseContent = {
  resultType: string;
  activity: Activity;
  organisation: Organisation;
};

type SearchResult = Organisation &
  Activity &
  MarketplaceItem & {
    resultType: string;
  };

export default SearchResult;
