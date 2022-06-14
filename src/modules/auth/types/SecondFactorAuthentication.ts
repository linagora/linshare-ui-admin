export default interface SecondFactorAuthentication {
  uuid: string;
  canDeleteIt: boolean;
  creationDate: number;
  enabled: boolean;
  required: boolean;
  sharedKey?: string;
}
