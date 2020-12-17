import Domain from '@/modules/domain/type/Domain';
import { DomainState } from './domain.state';

export default {
  setDomains (state: DomainState, domains: Domain[]) {
    state.domains = domains;
  }
};
