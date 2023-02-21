import Duplicate from './duplicate';

type DuplicateDto = {
  organisationWorkInProgressId: number;
  name: string;
  duplicateListItems: Duplicate[];
};

export default DuplicateDto;
