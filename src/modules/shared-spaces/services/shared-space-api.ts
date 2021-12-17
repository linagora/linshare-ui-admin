import api from '@/api';
import SharedSpace, { SHARED_SPACE_TYPE } from '@/modules/shared-spaces/types/SharedSpace';
import { SORT_ORDER } from '@/core/types/Sort';
import SharedSpaceRole from '../types/SharedSpaceRole';
import SharedSpaceMember from '../types/SharedSpaceMember';

export interface ListSharedSpaceOptions {
  account?: string;
  nodeType?: string;
  page?: number;
  size?: number;
  sortField?: string;
  sortOrder?: SORT_ORDER;
}

export interface SharedSpacesList {
  data: SharedSpace[];
  total: number;
  current: number;
}

async function listSharedSpaces (options: ListSharedSpaceOptions = {}): Promise<SharedSpacesList> {
  return await api.get('shared_spaces', {
    params: options,
    transformResponse: (data, headers): SharedSpacesList => ({
      data: JSON.parse(data),
      total: Number(headers ? headers['total-elements'] : 0),
      current: Number(headers ? headers['current-page'] : 0)
    })
  });
}

async function getSharedSpace (uuid: string): Promise<SharedSpace> {
  return await api.get(`shared_spaces/${uuid}`);
}

async function getSharedSpaceMembers (uuid: string): Promise<SharedSpaceMember[]> {
  return api.get(`shared_spaces/${uuid}/members`);
}

async function getSharedSpaceRoles (nodeType?: SHARED_SPACE_TYPE): Promise<SharedSpaceRole[]> {
  return api.get('shared_space_roles', { params: { nodeType } });
}

async function updateSharedSpace (payload: SharedSpace): Promise<SharedSpace> {
  return await api.put(`shared_spaces/${payload.uuid}`, payload);
}

async function createSharedSpaceMember (member: SharedSpaceMember): Promise<SharedSpaceMember> {
  return await api.post('shared_space_members', member);
}

async function updateSharedSpaceMember (member: SharedSpaceMember): Promise<SharedSpaceMember> {
  return await api.put(`shared_space_members/${member.uuid}`, member);
}

async function removeSharedSpaceMember (member: SharedSpaceMember) {
  return await api.delete(`shared_space_members/${member.uuid}`);
}

export {
  createSharedSpaceMember,
  getSharedSpace,
  getSharedSpaceRoles,
  getSharedSpaceMembers,
  listSharedSpaces,
  removeSharedSpaceMember,
  updateSharedSpace,
  updateSharedSpaceMember
};
