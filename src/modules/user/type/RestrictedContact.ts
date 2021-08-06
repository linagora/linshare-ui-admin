export default interface RestrictedContact {
  uuid: string;
  firstName: string;
  lastName: string;
  mail: string;
  domain: {
    uuid: string;
    name: string;
  };
}
