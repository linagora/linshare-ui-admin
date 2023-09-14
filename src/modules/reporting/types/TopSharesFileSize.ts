export interface TopSharesFileSizeItem {
  recipientType: string;
  recipientUuid: string;
  recipientMail: string;
  domainUuid: string;
  domainLabel: string;
  shareCount: number;
  shareTotalSize: number;
}

export interface TopSharesFileSize {
  pageNumber: number;
  pageSize: number;
  pageResponse: {
    totalElements: number;
    totalPages: number;
    content: TopSharesFileSizeItem[];
    first: boolean;
    last: boolean;
  };
  totalElements: number;
  list: TopSharesFileSizeItem[];
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
