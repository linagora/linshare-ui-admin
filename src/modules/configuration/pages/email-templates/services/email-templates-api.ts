import apiv4 from '@/apiv4';
import { MailConfiguration } from '../types/MailConfiguration';

async function getMailConfigurationList(domainUuid: string, currentDomainOnly: boolean): Promise<MailConfiguration[]> {
  return await apiv4.get(`mail_configs?domainId=${domainUuid}&onlyCurrentDomain=${currentDomainOnly}`);
}

export { getMailConfigurationList };
