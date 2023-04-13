import apiv4 from '@/apiv4';

// this is for sample, can update it
async function getEmailTemplates(domainUuid: string): Promise<never[]> {
  return await apiv4.get(`email-templates?domainId=${domainUuid}`);
}

export { getEmailTemplates };
