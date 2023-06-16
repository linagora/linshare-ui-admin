import apiv4 from '@/apiv4';
import { InconsistentUsers } from '../types/InconsistentUsers';
import { UserDiagnostic } from '../types/UserDiagnotic';

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

export { getInconsistentUsersList, deleteUser, migrateUser, userCheck };
