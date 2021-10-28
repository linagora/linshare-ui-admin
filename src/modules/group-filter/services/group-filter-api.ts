import api from '@/api';
import { LDAPGroupFilter } from '../types/GroupFilters';

async function listGroupFilters (): Promise<LDAPGroupFilter[]> {
  return await api.get('group_filters');
}

export {
  listGroupFilters
};
