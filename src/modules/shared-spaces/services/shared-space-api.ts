import api from '@/api';
import SharedSpace from '@/modules/shared-spaces/types/SharedSpace';
import { SORT_ORDER } from '@/core/types/Sort';

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

export {
  getSharedSpace,
  listSharedSpaces
};
