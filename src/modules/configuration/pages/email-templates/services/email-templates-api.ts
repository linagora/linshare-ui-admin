import apiv4 from '@/apiv4';
import api from '@/api';
import { MailConfiguration, MailLangDetail, MailLang } from '../types/MailConfiguration';
import { MailLayout } from '../types/MailLayout';
import { MailFooter } from '../types/MailFooter';

async function getMailConfigurationList(domainUuid: string, currentDomainOnly: boolean): Promise<MailConfiguration[]> {
  return await apiv4.get(`mail_configs?domainId=${domainUuid}&onlyCurrentDomain=${currentDomainOnly}`);
}

async function getMailConfigurationFooterList(domainUuid: string): Promise<MailFooter[]> {
  return await apiv4.get(`mail_configs/${domainUuid}/mail_footers`);
}

async function getMailConfigurationDetail(uuid: string, domainUuid: string): Promise<MailConfiguration> {
  return await apiv4.get(`mail_configs/${uuid}?domainId=${domainUuid}`);
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

async function getLayoutEmailTemplates(domainUuid: string, onlyCurrentDomain: boolean): Promise<MailLayout[]> {
  return await apiv4.get(`mail_layouts?domainId=${domainUuid}&onlyCurrentDomain=${onlyCurrentDomain}`);
}

async function assignMailConfiguration(domainUuid: string, MailConfigurationUuid: string) {
  return await api.post(`domains/${domainUuid}/mail_config/${MailConfigurationUuid}/assign`);
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

async function deleteMailConfiguration(payload: { uuid: string }): Promise<MailConfiguration> {
  return await apiv4.delete('mail_configs', { data: payload });
}

export {
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
};
