export default interface DomainTreeNode {
  uuid: string;
  name: string;
  type: 'ROOTDOMAIN' | 'TOPDOMAIN' | 'SUBDOMAIN' | 'GUESTDOMAIN';
  children: DomainTreeNode[];
}