import apiv4 from '@/apiv4';
import api from '@/api';
import { MailConfiguration, MailLangDetail, MailLang, MailFooterLangs } from '../types/MailConfiguration';
import { MailLayout } from '../types/MailLayout';
import { MailFooter } from '../types/MailFooter';
import { MailContent } from '../types/MailContent';

async function getMailConfigurationList(domainUuid: string, currentDomainOnly: boolean): Promise<MailConfiguration[]> {
  return await apiv4.get(`mail_configs?domainId=${domainUuid}&onlyCurrentDomain=${currentDomainOnly}`);
}

async function getMailConfigurationFooterList(domainUuid: string): Promise<MailFooter[]> {
  return await apiv4.get(`mail_configs/${domainUuid}/mail_footers`);
}

async function getMailConfigurationDetail(uuid: string, domainUuid: string): Promise<MailConfiguration> {
  return await apiv4.get(`mail_configs/${uuid}?domainId=${domainUuid}`);
}

async function getMailLayoutDetail(uuid: string, domainUuid: string): Promise<MailLayout> {
  return await apiv4.get(`mail_layouts/${uuid}?domainId=${domainUuid}`);
}

async function getMailContentList(
  uuid: string | undefined,
  language: string | undefined,
  mailContentType: string | undefined
): Promise<MailLangDetail[]> {
  return await apiv4.get(`mail_configs/${uuid}/mail_contents?language=${language}&mailContentType=${mailContentType}`);
}

async function getMailConfigurationLanguagesSupport(): Promise<string[]> {
  return await apiv4.post(`enums/language`);
}

async function updateMailConfigurationMailContent(payload: MailLang): Promise<MailLangDetail> {
  return await apiv4.put(`mail_content_langs`, payload);
}

async function getMailLayoutList(domainUuid: string, currentDomainOnly: boolean): Promise<MailLayout[]> {
  return await apiv4.get(`mail_layouts?domainId=${domainUuid}&onlyCurrentDomain=${currentDomainOnly}`);
}

async function getLayoutEmailTemplates(domainUuid: string, onlyCurrentDomain: boolean): Promise<MailLayout[]> {
  return await apiv4.get(`mail_layouts?domainId=${domainUuid}&onlyCurrentDomain=${onlyCurrentDomain}`);
}

async function assignMailConfiguration(domainUuid: string, MailConfigurationUuid: string) {
  return await api.post(`domains/${domainUuid}/mail_config/${MailConfigurationUuid}/assign`);
}

async function assignMailFooterToMailConfiguration(payload: MailLang) {
  return await apiv4.put(`mail_footer_langs`, payload);
}

async function createMailConfiguration(payload: {
  name: string;
  domain: string | null;
  domainName: string | undefined;
  mailContentLangs: any[];
  mailFooterLangs: any;
  mailLayout: string | undefined;
  visible: boolean;
  readonly: boolean;
}) {
  return await apiv4.post(`mail_configs`, payload);
}

async function updateMailConfiguration(payload: MailConfiguration) {
  return await apiv4.put(`mail_configs`, payload);
}

async function updateMailLayout(payload: MailLayout) {
  return await apiv4.put(`mail_layouts`, payload);
}

async function createMailLayout(payload: {
  description: string;
  domain: string;
  domainName: string;
  layout: string;
  messagesEnglish: string;
  messagesFrench: string;
  messagesRussian: string;
  visible: boolean;
  readonly: boolean;
}) {
  return await apiv4.post(`mail_layouts`, payload);
}

async function deleteMailConfiguration(payload: { uuid: string }): Promise<MailConfiguration> {
  return await apiv4.delete('mail_configs', { data: payload });
}

async function deleteMailLayout(payload: { uuid: string }): Promise<MailLayout> {
  return await apiv4.delete('mail_layouts', { data: payload });
}

// EMAIL FOOTER

async function getMailFooterDetail(uuid: string, domainUuid: string): Promise<MailFooter> {
  return await apiv4.get(`mail_footers/${uuid}?domainId=${domainUuid}`);
}
async function getMailFooterList(domainUuid: string, currentDomainOnly: boolean): Promise<MailFooter[]> {
  return await apiv4.get(`mail_footers?domainId=${domainUuid}&onlyCurrentDomain=${currentDomainOnly}`);
}

async function getFooterEmailTemplates(domainUuid: string, onlyCurrentDomain: boolean): Promise<MailFooter[]> {
  return await apiv4.get(`mail_footers?domainId=${domainUuid}&onlyCurrentDomain=${onlyCurrentDomain}`);
}
async function updateMailFooter(payload: MailFooter) {
  return await apiv4.put(`mail_footers`, payload);
}

async function createMailFooter(payload: {
  description: string;
  domain: string;
  domainName?: string;
  footer: string;
  messagesEnglish: string;
  messagesFrench: string;
  messagesRussian: string;
  visible: boolean;
  readonly: boolean;
}) {
  return await apiv4.post(`mail_footers`, payload);
}
async function deleteMailFooter(payload: { uuid: string }): Promise<MailFooter> {
  return await apiv4.delete('mail_footers', { data: payload });
}

// EMAIL CONTENT

async function getMailContentDetail(uuid: string, domainUuid: string): Promise<MailContent> {
  return await apiv4.get(`mail_contents/${uuid}?domainId=${domainUuid}`);
}
async function getMailContentLists(domainUuid: string, currentDomainOnly: boolean): Promise<MailContent[]> {
  return await apiv4.get(`mail_contents?domainId=${domainUuid}&onlyCurrentDomain=${currentDomainOnly}`);
}

async function getContentEmailTemplates(domainUuid: string, onlyCurrentDomain: boolean): Promise<MailContent[]> {
  return await apiv4.get(`mail_contents?domainId=${domainUuid}&onlyCurrentDomain=${onlyCurrentDomain}`);
}
async function updateMailContent(payload: MailContent) {
  return await apiv4.put(`mail_contents`, payload);
}

async function createMailContent(payload: {
  description: string;
  domain: string;
  domainName?: string;
  content: string;
  messagesEnglish: string;
  messagesFrench: string;
  messagesRussian: string;
  visible: boolean;
  readonly: boolean;
}) {
  return await apiv4.post(`mail_contents`, payload);
}
async function deleteMailContent(payload: { uuid: string }): Promise<MailContent> {
  return await apiv4.delete('mail_contents', { data: payload });
}

export {
  deleteMailLayout,
  getMailContentList,
  updateMailConfiguration,
  assignMailConfiguration,
  getLayoutEmailTemplates,
  deleteMailConfiguration,
  createMailConfiguration,
  getMailConfigurationList,
  getMailConfigurationDetail,
  getMailConfigurationFooterList,
  getMailConfigurationLanguagesSupport,
  updateMailConfigurationMailContent,
  getMailLayoutList,
  createMailLayout,
  updateMailLayout,
  getMailLayoutDetail,
  getFooterEmailTemplates,
  deleteMailFooter,
  getMailFooterList,
  createMailFooter,
  updateMailFooter,
  getMailFooterDetail,
  assignMailFooterToMailConfiguration,
  getContentEmailTemplates,
  deleteMailContent,
  getMailContentLists,
  createMailContent,
  updateMailContent,
  getMailContentDetail,
};
