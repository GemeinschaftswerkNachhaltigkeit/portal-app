import Organisation from 'src/app/shared/models/organisation';
import Activity from 'src/app/shared/models/actvitiy';
export type SearchResultResponseContent = {
  resultType: string;
  activity: Activity;
  organisation: Organisation;
};

type SearchResult = Organisation &
  Activity & {
    resultType: string;
  };

export default SearchResult;
