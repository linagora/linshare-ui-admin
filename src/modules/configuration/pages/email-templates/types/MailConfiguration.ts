export interface MailConfiguration {
  creationDate?: number;
  domain: string;
  mailContentLangs: {
    language: string;
    mailConfig: string;
    mailContent: string;
    mailContentype: string;
    readonly: boolean;
    uuid: string;
  };
  mailFooterLangs: {
    entry: {
      key: string;
      value: {
        language: string;
        mailConfig: string;
        mailContent: string;
        mailContentype: string;
        readonly: boolean;
        uuid: string;
      };
    };
  };
  mailLayout: string;
  modificationDate: number;
  name: string;
  readonly: string;
  uuid: string;
  visible: boolean;
}
