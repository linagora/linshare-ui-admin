export interface TopSharesFileCountItem {
  recipientType: string;
  recipientUuid: string;
  recipientMail: string;
  domainUuid: string;
  domainLabel: string;
  shareCount: number;
  shareTotalSize: number;
}

export interface TopSharesFileCount {
  pageNumber: number;
  pageSize: number;
  pageResponse: {
    totalElements: number;
    totalPages: number;
    content: TopSharesFileCountItem[];
    first: boolean;
    last: boolean;
  };
  totalElements: number;
  list: TopSharesFileCountItem[];
  defaultPageRequest: {
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    offset: number;
    pageNumber: number;
    pageSize: number;
    paged: boolean;
    unpaged: boolean;
  };
}
