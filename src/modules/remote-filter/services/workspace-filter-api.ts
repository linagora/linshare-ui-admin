import api from '@/api';
import Domain from '@/modules/domain/types/Domain';
import { LDAPWorkspaceFilter } from '../types/WorkspaceFilters';

async function listWorkspaceFilters(listModel?: boolean): Promise<LDAPWorkspaceFilter[]> {
  return await api.get('workspace_filters', {
    params: {
      model: listModel,
    },
  });
}

async function createWorkspaceFilter(filter: LDAPWorkspaceFilter): Promise<LDAPWorkspaceFilter> {
  return await api.post('workspace_filters', filter);
}

async function updateWorkspaceFilter(filter: LDAPWorkspaceFilter): Promise<LDAPWorkspaceFilter> {
  return await api.put(`workspace_filters/${filter.uuid}`, filter);
}

async function getWorkspaceFilter(uuid: string): Promise<LDAPWorkspaceFilter> {
  return await api.get(`workspace_filters/${uuid}`);
}

async function getWorkspaceFilterAssociatedDomains(uuid: string): Promise<Domain[]> {
  return await api.get(`workspace_filters/${uuid}/domains`);
}

async function deleteWorkspaceFilter(uuid: string): Promise<LDAPWorkspaceFilter> {
  return await api.delete(`workspace_filters/${uuid}`);
}

export {
  createWorkspaceFilter,
  deleteWorkspaceFilter,
  getWorkspaceFilter,
  getWorkspaceFilterAssociatedDomains,
  listWorkspaceFilters,
  updateWorkspaceFilter,
};
