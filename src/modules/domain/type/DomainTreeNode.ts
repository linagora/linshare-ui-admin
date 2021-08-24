export default interface DomainTreeNode {
  uuid: string;
  name?: string;
  type?: 'ROOTDOMAIN' | 'TOPDOMAIN' | 'SUBDOMAIN' | 'GUESTDOMAIN';
  children?: DomainTreeNode[];
};

export const EMPTY_DOMAIN_NODE: DomainTreeNode = {
  uuid: ''
};
