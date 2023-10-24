import apiv4 from '@/apiv4';
import { TechnicalAccount, TechnicalAccountCreation } from '../types/TechnicalAccount';

async function getTechnicalAccountsList(): Promise<TechnicalAccount[]> {
  return await apiv4.get(`/technical_accounts`);
}

async function createTechnicalAccount(payload: TechnicalAccountCreation): Promise<TechnicalAccount> {
  return await apiv4.post(`technical_accounts`, payload);
}

export { getTechnicalAccountsList, createTechnicalAccount };
