import { DOMAIN_TYPE } from './Domain';

export default interface DomainTreeNode {
  uuid: string;
  name?: string;
  type?: DOMAIN_TYPE;
  children?: DomainTreeNode[];
}

export const EMPTY_DOMAIN_NODE: DomainTreeNode = {
  uuid: ''
};
