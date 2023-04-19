export interface MailLayout {
  uuid: string;
  domain: {
    name: string;
    uuid: string;
  };
  description: string;
  layout: string;
  visible: boolean;
  creationDate: number;
  modificationDate: number;
  readonly: boolean;
  messagesFrench: string;
  messagesEnglish: string;
  messagesRussian: string;
}
