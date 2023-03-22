export interface MimePolicy {
  uuid: string;
  name: string;
  domainId: string;
  domainName: string;
  creationDate: number;
  modificationDate: number;
  mimeTypes?: MimeType[];
}

export interface MimeType {
  uuid: string;
  mimeType: string;
  extensions: string;
  enable: boolean;
  creationDate: number;
  modificationDate: number;
}
