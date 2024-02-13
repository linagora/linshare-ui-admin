export interface MailContent {
  description: string;
  domain: string;
  domainName?: string;
  domainLabel: string;
  visible: boolean;
  footer: string;
  creationDate: number;
  modificationDate: number;
  uuid: string;
  plaintext: boolean;
  readonly: boolean;
  messagesFrench: string;
  messagesEnglish: string;
  messagesRussian: string;
  messagesVietnamese: string;
  body: string;
  mailContentType: string;
  subject: string;
  context?: number;
  config?: string;
}
