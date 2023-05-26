import apiv4 from '@/apiv4';
import { InconsistentUsers } from '../types/InconsistentUsers';

async function getInconsistentUsersList(): Promise<InconsistentUsers[]> {
  return await apiv4.get('users/inconsistent');
}

async function deleteUser(payload: InconsistentUsers): Promise<InconsistentUsers> {
  return await apiv4.delete('users', { data: payload });
}

export { getInconsistentUsersList, deleteUser };
