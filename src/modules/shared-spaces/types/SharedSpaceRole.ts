export default interface SharedSpaceRole {
  uuid: string;
  name: string;
  enabled?: boolean;
  type: 'DRIVE' | 'WORK_GROUP'
}
