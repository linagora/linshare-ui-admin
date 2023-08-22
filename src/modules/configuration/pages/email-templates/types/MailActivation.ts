export interface MailActivation {
  identifier: string;
  domain: string;
  activationPolicy: {
    policy: string;
    status: boolean;
    defaultStatus: boolean;
    parentAllowUpdate: boolean;
    system: boolean;
  };
  configurationPolicy: {
    policy: string;
    status: boolean;
    defaultStatus: boolean;
    parentAllowUpdate: boolean;
    system: boolean;
  };
  delegationPolicy: {
    policy: string;
    status: boolean;
    defaultStatus: boolean;
    parentAllowUpdate: boolean;
    system: boolean;
  };
  enable: boolean;
}
