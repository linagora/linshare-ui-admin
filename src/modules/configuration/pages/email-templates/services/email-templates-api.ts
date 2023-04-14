import apiv4 from '@/apiv4';
import { MailConfiguration } from '../types/MailConfiguration';
import { MailLayout } from '../types/MailLayout';

async function getMailConfigurationList(domainUuid: string, currentDomainOnly: boolean): Promise<MailConfiguration[]> {
  return await apiv4.get(`mail_configs?domainId=${domainUuid}&onlyCurrentDomain=${currentDomainOnly}`);
}

async function getLayoutEmailTemplates(domainUuid: string, onlyCurrentDomain: boolean): Promise<MailLayout[]> {
  return await apiv4.get(`mail_layouts?domainId=${domainUuid}&onlyCurrentDomain=${onlyCurrentDomain}`);
}
export { getMailConfigurationList, getLayoutEmailTemplates };
