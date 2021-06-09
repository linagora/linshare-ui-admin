export default interface SharedSpace {
  uuid: string;
  name: string;
  parentUuid?: string;
  parentName?: string;
  creationDate: number;
  modificationDate: number;
  nodeType: 'WORK_GROUP' | 'DRIVE'
}
