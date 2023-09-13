import Domain from '@/core/types/Domain';

export interface DomainPolicy {
  identifier: string;
  label: string;
  description: string;
  accessPolicy: {
    rules: DomainPolicyRule[];
  };
  assigned?: boolean;
}

export interface DomainPolicyRule {
  type: string;
  domain: Domain;
}
