import apiv4 from '@/apiv4';
import { InconsistentUsers } from '../types/InconsistentUsers';

async function getInconsistentUsersList(): Promise<InconsistentUsers[]> {
  return await apiv4.get('users/inconsistent');
}

export { getInconsistentUsersList };
