import Domain from '@/core/types/Domain';

export interface DomainPolicy {
  identifier: string;
  label: string;
  description: string;
  accessPolicy: {
    rules: DomainPolicyRule[];
  };
  assigned?: boolean;
  creationDate?: number;
  modificationDate?: number;
}

export interface DomainPolicyRule {
  type: 'ALLOW' | 'ALLOW_ALL' | 'DENY' | 'DENY_ALL';
  domain: Domain;
}
