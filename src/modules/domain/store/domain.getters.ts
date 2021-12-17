import { GetterTree } from 'vuex';
import { DomainState } from './domain.state';
import RootState from '@/core/types/RootState';
import DomainTreeNode, { EMPTY_DOMAIN_NODE } from '../types/DomainTreeNode';
import Domain from '../types/Domain';

const getters: GetterTree<DomainState, RootState> = {
  getCurrentDomain: state => state.currentDomain,
  getCurrentDomainUuid: state => state.currentDomain.uuid,
  getCurrentDomainType: state => state.currentDomain.type,
  getDomainsTree: state => state.domainsTree,
  getDomainsList: state => getDomainsListFromTree(state.domainsTree),
  getDomainByUuid: state => (uuid: string) => getDomainFromTree(uuid, state.domainsTree),
  getStatus: state => (entity: 'currentDomain') => state.status[entity],
  isRootDomain: state => state.currentDomain.type === 'ROOTDOMAIN',
  isGuestDomain: state => state.currentDomain.type === 'GUESTDOMAIN'
};

function getDomainsListFromTree (node: DomainTreeNode): Domain[] {
  const list: Domain[] = [];

  function add (node: DomainTreeNode) {
    list.push({
      uuid: node.uuid,
      name: node.name,
      type: node.type
    });

    if (node.children?.length) {
      for (let i = 0; i < node.children.length; i++) {
        add(node.children[i]);
      }
    }
  }

  add(node);

  return list;
}

function getDomainFromTree (uuid: string, node: DomainTreeNode): DomainTreeNode {
  const target: DomainTreeNode = { ...EMPTY_DOMAIN_NODE };

  function find (node: DomainTreeNode) {
    if (node.uuid === uuid) {
      Object.assign(target, node);
    }

    if (node.children?.length) {
      for (let i = 0; i < node.children.length; i++) {
        find(node.children[i]);
      }
    }
  }

  find(node);

  return target;
}

export default getters;
