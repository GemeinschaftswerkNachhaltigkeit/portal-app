import Organisation from 'src/app/shared/models/organisation';
import { OrganisationWIP } from 'src/app/shared/models/organisation-wip';

type Duplicate = {
  organisation: Organisation;
  organisationWorkInProgress: OrganisationWIP;
  duplicateForFields: string[];
};

export default Duplicate;
