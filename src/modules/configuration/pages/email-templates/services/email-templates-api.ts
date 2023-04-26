import apiv4 from '@/apiv4';
import api from '@/api';
import { MailConfiguration } from '../types/MailConfiguration';
import { MailLayout } from '../types/MailLayout';

async function getMailConfigurationList(domainUuid: string, currentDomainOnly: boolean): Promise<MailConfiguration[]> {
  return await apiv4.get(`mail_configs?domainId=${domainUuid}&onlyCurrentDomain=${currentDomainOnly}`);
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

async function deleteMailConfiguration(payload: { uuid: string }): Promise<MailConfiguration> {
  return await apiv4.delete('mail_configs', { data: payload });
}

export {
  getMailConfigurationList,
  assignMailConfiguration,
  getLayoutEmailTemplates,
  deleteMailConfiguration,
  createMailConfiguration,
};
