export default interface RestrictedContact {
  uuid: string;
  firstName: string;
  lastName: string;
  mail: string;
  domain: {
    label: string;
    identifier: string;
    type: string;
  };
}
