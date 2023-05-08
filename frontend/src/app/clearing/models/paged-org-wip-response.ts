import { OrganisationWIP } from 'src/app/shared/models/organisation-wip';
import Paging from 'src/app/shared/models/paging';

type PagedOrganisationWipResponse = {
  content: OrganisationWIP[];
} & Paging;

export default PagedOrganisationWipResponse;
