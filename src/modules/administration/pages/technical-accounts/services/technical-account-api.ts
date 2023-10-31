import apiv4 from '@/apiv4';
import { TechnicalAccount, TechnicalAccountCreation, TechnicalAccountDetails } from '../types/TechnicalAccount';

async function getTechnicalAccountsList(): Promise<TechnicalAccount[]> {
  return await apiv4.get(`/technical_accounts`);
}

async function createTechnicalAccount(payload: TechnicalAccountCreation): Promise<TechnicalAccount> {
  return await apiv4.post(`technical_accounts`, payload);
}

async function getTechnicalAccountDetail(uuid: string | string[]): Promise<TechnicalAccountDetails> {
  return await apiv4.get(`/technical_accounts/${uuid}`);
}

async function updateTechnicalAccount(payload: TechnicalAccountDetails): Promise<TechnicalAccount> {
  return await apiv4.put(`/technical_accounts`, payload);
}

async function deleteTechnicalAccount(payload: TechnicalAccount): Promise<TechnicalAccount> {
  return await apiv4.delete(`technical_accounts`, { data: payload });
}

export {
  getTechnicalAccountsList,
  createTechnicalAccount,
  getTechnicalAccountDetail,
  updateTechnicalAccount,
  deleteTechnicalAccount,
};
