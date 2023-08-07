export interface MailContext {
  mailType: string;
  variables: {
    name: string;
    type: string;
    stringValue: string;
    variables: {
      name: string;
      type: string;
      stringValue: string;
    }[];
  }[];
}
