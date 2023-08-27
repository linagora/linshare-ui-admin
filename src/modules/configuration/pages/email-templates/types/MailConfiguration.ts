export type MailFooterLangs = { [key: string]: MailLang };
export interface MailConfiguration {
  creationDate?: number;
  domain: string;
  domainName: string;
  mailContentLangs: MailLang[];
  mailFooterLangs: MailFooterLangs;
  mailLayout: string;
  modificationDate: number;
  name: string;
  readonly: string;
  uuid: string;
  visible: boolean;
  assigned?: boolean;
  selectLanguage?: string;
}

export interface MailLang {
  language: string;
  mailConfig: string;
  mailContent: string;
  mailContentType: string;
  mailFooter?: string;
  readonly: boolean;
  uuid: string;
  mailContentDomainName?: string;
  mailContentName?: string;
  mailContentModificationDate?: string | number;
  legend: string;
}

export interface MailLangDetail {
  description: string;
  domain: string;
  domainLabel?: string;
  visible: boolean;
  mailContentType: string;
  subject: string;
  body: string;
  creationDate: number;
  modificationDate: number;
  uuid: string;
  readonly: boolean;
  messagesFrench: string;
  messagesEnglish: string;
  messagesRussian: string;
}
