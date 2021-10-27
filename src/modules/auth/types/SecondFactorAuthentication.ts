export default interface SecondFactorAuthentication {
  uuid: string;
  canDeleteIt: boolean;
  creationDate: string;
  enabled: boolean;
  required: boolean;
  sharedKey?: string;
}
