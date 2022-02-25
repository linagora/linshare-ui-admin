import api from '@/api';
import Domain from '@/modules/domain/types/Domain';
import UserFilter from '../types/UserFilter';

async function listUserFilters (listModel?: boolean): Promise<UserFilter[]> {
  return await api.get('user_filters', {
    params: {
      model: listModel
    }
  });
}

async function createUserFilter (filter: Partial<UserFilter>): Promise<UserFilter> {
  return await api.post('user_filters', filter);
}

async function updateUserFilter (uuid: string, filter: Partial<UserFilter>): Promise<UserFilter> {
  return await api.put(`user_filters/${uuid}`, filter);
}

async function getUserFilter (uuid: string): Promise<UserFilter> {
  return await api.get(`user_filters/${uuid}`);
}

async function getAssociatedDomains (uuid: string): Promise<Domain[]> {
  return await api.get(`user_filters/${uuid}/domains`);
}

async function deleteUserFilter (uuid: string): Promise<UserFilter> {
  return await api.delete(`user_filters/${uuid}`);
}

export {
  listUserFilters,
  createUserFilter,
  updateUserFilter,
  getUserFilter,
  getAssociatedDomains,
  deleteUserFilter
};
