import { defineStore } from 'pinia';
import { useAuthStore } from '@/modules/auth/store';
import Status from '@/core/types/Status';
import type { Functionality } from '@/core/types/Functionality';
import Domain, { EMPTY_DOMAIN } from '@/modules/domain/types/Domain';
import DomainTreeNode, { EMPTY_DOMAIN_NODE } from '@/modules/domain/types/DomainTreeNode';

import {
  getDomains,
  getDomain,
  updateDomain,
  deleteDomain,
  getFunctionalties,
  updateFunctionality,
} from '@/modules/domain/services/domain-api';

interface DomainState {
  currentDomain: Domain;
  currentDomainFunctionalities: Functionality[];
  loggedUserFunctionalities?: Functionality[];
  domainsTree: DomainTreeNode;
  status: {
    currentDomain: Status;
    currentDomainFunctionalities: Status;
  };
}

export const useDomainStore = defineStore('domainStore', {
  state: (): DomainState => ({
    currentDomain: EMPTY_DOMAIN,
    currentDomainFunctionalities: [],
    domainsTree: EMPTY_DOMAIN_NODE,
    status: {
      currentDomain: Status.LOADING,
      currentDomainFunctionalities: Status.LOADING,
    },
  }),
  getters: {
    getMainFunctionalities: (state): Functionality[] =>
      state.currentDomainFunctionalities.filter((functionality) => !functionality.parentIdentifier),
    getFunctionality:
      (state) =>
      (id: string): Functionality | undefined =>
        state.currentDomainFunctionalities.find((functionality) => functionality.identifier === id),
    getSubFunctionalities:
      (state) =>
      (parentId: string): Functionality[] =>
        state.currentDomainFunctionalities.filter((functionality) => functionality.parentIdentifier === parentId),
    getLoggedUserFunctionality:
      (state) =>
      (id: string): Functionality | undefined =>
        state.loggedUserFunctionalities?.find((functionality) => functionality.identifier === id),
    getDomainsList: (state): Domain[] => _getDomainsListFromTree(state.domainsTree),
    getDomainByUuid:
      (state) =>
      (uuid: string): DomainTreeNode =>
        _getDomainFromTree(uuid, state.domainsTree),
    getStatus:
      (state) =>
      (entity: 'currentDomain' | 'currentDomainFunctionalities'): Status =>
        state.status[entity],
    isRootDomain: (state): boolean => state.currentDomain.type === 'ROOTDOMAIN',
    isGuestDomain: (state): boolean => state.currentDomain.type === 'GUESTDOMAIN',
  },
  actions: {
    setCurrentDomainUuid(uuid: string) {
      this.currentDomain = { ...this.currentDomain, uuid };
    },
    async fetchDomainsTree() {
      const domains = await getDomains({ params: { tree: true } });

      this.domainsTree = domains[0];
    },
    async fetchDomain() {
      this.status.currentDomain = Status.LOADING;

      try {
        const domain = await getDomain(this.currentDomain.uuid, { params: { detail: true } });

        this.currentDomain = { ...this.currentDomain, ...domain };
        this.status.currentDomain = Status.SUCCESS;
      } catch (error) {
        this.status.currentDomain = Status.ERROR;
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
    async fetchLoggedUserFunctionalities() {
      const authStore = useAuthStore();
      const loggedUser = authStore.loggedUser;

      if (!loggedUser) return;

      const functionalities = await getFunctionalties(loggedUser.domain.uuid, { includeSubs: true });

      this.loggedUserFunctionalities = functionalities;
    },
    async fetchDomainFunctionalities() {
      this.status.currentDomainFunctionalities = Status.LOADING;

      try {
        const functionalities = await getFunctionalties(this.currentDomain.uuid, { includeSubs: true });

        this.currentDomainFunctionalities = functionalities;
        this.status.currentDomainFunctionalities = Status.SUCCESS;
      } catch (error) {
        this.status.currentDomainFunctionalities = Status.ERROR;
      }
    },
    async updateDomainFunctionality(functionality: Functionality) {
      const updated = await updateFunctionality(this.currentDomain.uuid, functionality);
      const index = this.currentDomainFunctionalities.findIndex((func) => func.identifier === updated.identifier);

      if (index > -1) {
        this.currentDomainFunctionalities[index] = updated;
      }
    },
    dehydrate(): void {
      this.currentDomain = EMPTY_DOMAIN;
      this.domainsTree = EMPTY_DOMAIN_NODE;
      this.loggedUserFunctionalities = undefined;
      this.currentDomainFunctionalities = [];
      this.status = {
        currentDomain: Status.LOADING,
        currentDomainFunctionalities: Status.LOADING,
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
