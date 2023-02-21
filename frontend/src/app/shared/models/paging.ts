export const defaultPaginatorOptions = {
  pageSize: 25,
  pageSizeOptions: [5, 10, 25, 100]
};
export type PageQuerParams = {
  page?: number;
  size?: number;
  sort?: string;
};

type Paging = {
  number?: number;
  size?: number;
  totalElements?: number;
  totalPages?: number;
};

export default Paging;
