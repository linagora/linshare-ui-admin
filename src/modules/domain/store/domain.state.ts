import Domain from '@/modules/domain/type/Domain';

export interface DomainState {
  domains: Domain[];
}

const state: DomainState = {
  domains: []
};

export default state;
