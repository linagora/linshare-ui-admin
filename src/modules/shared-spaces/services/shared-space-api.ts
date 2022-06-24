import api from '@/api';
import SharedSpace, { SHARED_SPACE_TYPE } from '@/modules/shared-spaces/types/SharedSpace';
import { SORT_ORDER } from '@/core/types/Sort';
import type SharedSpaceRole from '../types/SharedSpaceRole';
import type SharedSpaceMember from '../types/SharedSpaceMember';
import type { PaginatedList } from '@/core/types/PaginatedList';

export interface ListSharedSpaceOptions {
  account?: string;
  nodeType?: string;
  page?: number;
  size?: number;
  sortField?: string;
  sortOrder?: SORT_ORDER;
}

async function listSharedSpaces(options: ListSharedSpaceOptions = {}): Promise<PaginatedList<SharedSpace>> {
  return await api.get('shared_spaces', { params: options });
}

async function getSharedSpace(uuid: string): Promise<SharedSpace> {
  return await api.get(`shared_spaces/${uuid}`);
}

async function getSharedSpaceMembers(uuid: string): Promise<PaginatedList<SharedSpaceMember>> {
  return api.get(`shared_spaces/${uuid}/members`);
}

async function getSharedSpaceRoles(nodeType?: SHARED_SPACE_TYPE): Promise<SharedSpaceRole[]> {
  return api.get('shared_space_roles', { params: { nodeType } });
}

async function updateSharedSpace(payload: SharedSpace): Promise<SharedSpace> {
  return await api.put(`shared_spaces/${payload.uuid}`, payload);
}

async function deleteSharedSpace(payload: SharedSpace): Promise<SharedSpace> {
  return await api.delete(`shared_spaces/${payload.uuid}`);
}

async function createSharedSpaceMember(member: SharedSpaceMember): Promise<SharedSpaceMember> {
  return await api.post('shared_space_members', member);
}

async function updateSharedSpaceMember(member: SharedSpaceMember, force?: boolean): Promise<SharedSpaceMember> {
  return await api.put(`shared_space_members/${member.uuid}`, member, {
    params: {
      force,
    },
  });
}

async function removeSharedSpaceMember(member: SharedSpaceMember): Promise<void> {
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
  updateSharedSpaceMember,
  deleteSharedSpace,
};
