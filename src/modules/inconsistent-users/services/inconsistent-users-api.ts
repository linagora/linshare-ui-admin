import apiv4 from '@/apiv4';
import { InconsistentUsers } from '../types/InconsistentUsers';
import { UserDiagnostic, UsersDiagnosticDetail } from '../types/UserDiagnotic';

async function getInconsistentUsersList(): Promise<InconsistentUsers[]> {
  return await apiv4.get('users/inconsistent');
}

async function deleteUser(payload: InconsistentUsers): Promise<InconsistentUsers> {
  return await apiv4.delete('users', { data: payload });
}

async function migrateUser(payload: InconsistentUsers): Promise<InconsistentUsers> {
  return await apiv4.put('users/inconsistent', payload);
}

async function userCheck(mail: string): Promise<UserDiagnostic> {
  const payload = { mail: mail };
  return await apiv4.post('users/inconsistent/check', payload);
}

async function getDiagnoticUserDetails(userUuid: string): Promise<UsersDiagnosticDetail> {
  return await apiv4.get(`users/${userUuid}`);
}

async function saveDiagnosticUserchanges(payload: UsersDiagnosticDetail): Promise<UsersDiagnosticDetail> {
  return await apiv4.put('users', payload);
}

async function getDiagnosticuserQuota(uuid: string) {
  return await apiv4.get(`quotas/accounts/${uuid}`);
}

async function createDiagnosticUser(domain: string, mail: string) {
  const payload = {
    domain: domain,
    mail: mail,
  };
  return await apiv4.post('users', payload);
}

export {
  getInconsistentUsersList,
  deleteUser,
  migrateUser,
  userCheck,
  getDiagnoticUserDetails,
  saveDiagnosticUserchanges,
  getDiagnosticuserQuota,
  createDiagnosticUser,
};
