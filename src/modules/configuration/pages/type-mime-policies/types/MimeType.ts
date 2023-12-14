export interface MimePolicy {
  uuid: string;
  creationDate?: number;
  name: string;
  modificationDate: number;
  domainId: string;
  domainName: string;
  mimeTypes?: boolean;
  assigned?: boolean;
  unknownTypeAllowed?: boolean;
}

export interface MimeType {
  uuid: string;
  mimeType: string;
  extensions: string;
  enable: boolean;
  creationDate: number;
  modificationDate: number;
}
