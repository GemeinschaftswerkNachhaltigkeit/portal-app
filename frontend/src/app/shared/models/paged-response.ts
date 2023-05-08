import Paging from 'src/app/shared/models/paging';

type PagedResponse<T> = {
  content: T[];
} & Paging;

export default PagedResponse;
