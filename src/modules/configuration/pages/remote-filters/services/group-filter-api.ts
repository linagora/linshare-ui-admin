import api from '@/api';
import { LDAPGroupFilter } from '../types/GroupFilters';
import Domain from '@/modules/domain/types/Domain';

async function listGroupFilters(listModel?: boolean): Promise<LDAPGroupFilter[]> {
  return await api.get('group_filters', {
    params: { model: listModel },
  });
}

async function createGroupFilter(filter: Omit<LDAPGroupFilter, 'uuid'>): Promise<LDAPGroupFilter> {
  return await api.post('group_filters', filter);
}

async function updateGroupFilter(filter: LDAPGroupFilter): Promise<LDAPGroupFilter> {
  return await api.put(`group_filters/${filter.uuid}`, filter);
}

async function getGroupFilter(uuid: string | string[]): Promise<LDAPGroupFilter> {
  return await api.get(`group_filters/${uuid}`);
}

async function getGroupFilterAssociatedDomains(uuid: string | string[]): Promise<Domain[]> {
  return await api.get(`group_filters/${uuid}/domains`);
}

async function deleteGroupFilter(uuid: string | string[]): Promise<LDAPGroupFilter> {
  return await api.delete(`group_filters/${uuid}`);
}

export {
  createGroupFilter,
  deleteGroupFilter,
  getGroupFilter,
  getGroupFilterAssociatedDomains,
  listGroupFilters,
  updateGroupFilter,
};
