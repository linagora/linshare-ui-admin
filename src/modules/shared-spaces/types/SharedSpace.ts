export enum SHARED_SPACE_TYPE {
  WORKGROUP = 'WORK_GROUP',
  WORKSPACE = 'WORK_SPACE',
}
export default interface SharedSpace {
  uuid: string;
  name: string;
  domainUuid?: string;
  parentUuid?: string;
  parentName?: string;
  creationDate?: number;
  modificationDate?: number;
  nodeType?: SHARED_SPACE_TYPE;
  author?: {
    name: string;
    mail: string;
    uuid: string;
  };
}

export const EMPTY_SHARED_SPACE: SharedSpace = {
  uuid: '',
  name: '',
};
