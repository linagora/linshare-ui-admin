import api from '@/api';
import Domain from '@/modules/domain/types/Domain';
import { LDAPDriveFilter } from '../types/DriveFilters';

async function listDriveFilters (listModel?: boolean): Promise<LDAPDriveFilter[]> {
  return await api.get('drive_filters', {
    params: {
      model: listModel
    }
  });
}

async function createDriveFilter (filter: LDAPDriveFilter): Promise<LDAPDriveFilter> {
  return await api.post('drive_filters', filter);
}

async function updateDriveFilter (filter: LDAPDriveFilter): Promise<LDAPDriveFilter> {
  return await api.put(`drive_filters/${filter.uuid}`, filter);
}

async function getDriveFilter (uuid: string): Promise<LDAPDriveFilter> {
  return await api.get(`drive_filters/${uuid}`);
}

async function getDriveFilterAssociatedDomains (uuid: string): Promise<Domain[]> {
  return await api.get(`drive_filters/${uuid}/domains`);
}

async function deleteDriveFilter (uuid: string): Promise<LDAPDriveFilter> {
  return await api.delete(`drive_filters/${uuid}`);
}

export {
  createDriveFilter,
  deleteDriveFilter,
  getDriveFilter,
  getDriveFilterAssociatedDomains,
  listDriveFilters,
  updateDriveFilter
};
