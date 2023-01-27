import { defineStore } from 'pinia';
import { STATUS } from '@/core/types/Status';
import Domain, { DOMAIN_TYPE, EMPTY_DOMAIN } from '@/modules/domain/types/Domain';
import DomainTreeNode, { EMPTY_DOMAIN_NODE } from '@/modules/domain/types/DomainTreeNode';

import { getDomains, getDomain, updateDomain, deleteDomain } from '@/modules/domain/services/domain-api';

interface DomainState {
  currentDomain: Domain;
  domainsTree: DomainTreeNode;
  status: {
    currentDomain: STATUS;
  };
}

export const useDomainStore = defineStore('domainStore', {
  state: (): DomainState => ({
    currentDomain: EMPTY_DOMAIN,
    domainsTree: EMPTY_DOMAIN_NODE,
    status: {
      currentDomain: STATUS.LOADING,
    },
  }),
  getters: {
    getDomainsList: (state): Domain[] => _getDomainsListFromTree(state.domainsTree),
    getDomainByUuid:
      (state) =>
      (uuid: string): DomainTreeNode =>
        _getDomainFromTree(uuid, state.domainsTree),
    getStatus:
      (state) =>
      (entity: 'currentDomain'): STATUS =>
        state.status[entity],
    getCurrentDomain: (state): Domain => state.currentDomain,
    isRootDomain: (state): boolean => state.currentDomain.type === DOMAIN_TYPE.ROOT,
    isGuestDomain: (state): boolean => state.currentDomain.type === DOMAIN_TYPE.GUEST,
    isSubDomain: (state): boolean => state.currentDomain.type === DOMAIN_TYPE.SUB,
    isTopDomain: (state): boolean => state.currentDomain.type === DOMAIN_TYPE.TOP,
    topMostDomain: (state): Domain => state.domainsTree,
  },
  actions: {
    setCurrentDomainUuid(uuid: string) {
      this.currentDomain = { ...this.currentDomain, uuid };
    },

    setCurrentDomain(currentDomain: DomainTreeNode) {
      this.currentDomain = { ...currentDomain };
    },
    async fetchDomainsTree() {
      const domains = await getDomains({ params: { tree: true } });

      this.domainsTree = domains[0];
    },
    async fetchDomain() {
      this.status.currentDomain = STATUS.LOADING;

      try {
        const domain = await getDomain(this.currentDomain.uuid, { params: { detail: true } });

        this.currentDomain = { ...this.currentDomain, ...domain };
        this.status.currentDomain = STATUS.SUCCESS;
      } catch (error) {
        this.status.currentDomain = STATUS.ERROR;
      }
    },
    async updateDomain(domain: Domain) {
      const updated = await updateDomain(domain);

      this.currentDomain = { ...this.currentDomain, ...updated };
      _updateDomainName(this.domainsTree, updated);
    },
    async deleteCurrentDomain() {
      await deleteDomain(this.currentDomain);
      await this.fetchDomainsTree();
      this.currentDomain = { ...this.currentDomain, ...this.domainsTree };
      await this.fetchDomain();
    },
    dehydrate(): void {
      this.currentDomain = EMPTY_DOMAIN;
      this.domainsTree = EMPTY_DOMAIN_NODE;
      this.status = {
        currentDomain: STATUS.LOADING,
      };
    },
  },
});

function _getDomainsListFromTree(node: DomainTreeNode): Domain[] {
  const list: Domain[] = [];

  function add(node: DomainTreeNode) {
    list.push({
      uuid: node.uuid,
      name: node.name,
      type: node.type,
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

function _getDomainFromTree(uuid: string, node: DomainTreeNode): DomainTreeNode {
  const target: DomainTreeNode = { ...EMPTY_DOMAIN_NODE };

  function find(node: DomainTreeNode) {
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

function _updateDomainName(domain: DomainTreeNode, updated: Domain) {
  if (domain.uuid === updated.uuid) {
    domain.name = updated.name;

    return;
  }

  if (domain.children) {
    for (let index = 0; index < domain.children.length; index++) {
      _updateDomainName(domain.children[index], updated);
    }
  }
}
