import apiv4 from '@/apiv4';
import { TechnicalAccount } from '../types/TechnicalAccount';

async function getTechnicalAccountsList(): Promise<TechnicalAccount[]> {
  return await apiv4.get(`/technical_accounts`);
}

export { getTechnicalAccountsList };
