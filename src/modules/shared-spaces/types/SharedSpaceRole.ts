export default interface SharedSpaceRole {
  uuid: string;
  name: string;
  enabled?: boolean;
  type: 'WORK_SPACE' | 'WORK_GROUP';
}
