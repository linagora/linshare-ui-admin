export interface MailLayout {
  uuid: string;
  domain: string;
  domainName: string;
  description: string;
  layout: string;
  visible: boolean;
  creationDate: number;
  modificationDate: number;
  readonly: boolean;
  messagesFrench: string;
  messagesEnglish: string;
  messagesRussian: string;
  messagesVietnamese: string;
  assigned?: boolean;
}
