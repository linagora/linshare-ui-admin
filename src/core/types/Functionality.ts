interface Config {
  value: boolean;
  parentValue: boolean;
  overriden: boolean;
}

interface Policy {
  hidden: boolean;
  readonly: boolean;
  enable: Config;
  allowOverride: Config;
}

interface BooleanParameter {
  hidden: boolean;
  readonly: boolean;
  type: 'BOOLEAN'
  default: {
    type: 'BOOLEAN';
    value: boolean;
    parentValue: boolean;
    overridden: boolean;
  }
}

interface StringParameter {
  hidden: boolean;
  readonly: boolean;
  type: 'STRING';
  default: {
    type: 'STRING';
    value: string;
    parentValue: string;
    overridden: boolean;
  }
}

interface UnitTimeAllParameter {
  hidden: boolean;
  readonly: boolean;
  type: 'UNIT_TIME_ALL';
  default: {
    type: 'UNIT_TIME';
    value: number;
    parentValue: number;
    overridden: boolean;
    unit: string;
    units: string[];
    parentUnit: string;
  }
  maximum: {
    type: 'UNIT_TIME';
    value: number;
    parentValue: number;
    overridden: boolean;
    unit: string;
    units: string[];
    parentUnit: string;
  }
  unlimited: {
    supported: boolean;
    value: boolean;
    parentValue: boolean;
  }
}

interface UnitTimeDefaultParameter {
  hidden: boolean;
  type: 'UNIT_TIME_DEFAULT';
  readonly: boolean;
  default: {
    type: 'UNIT_TIME';
    value: number;
    parentValue: number;
    overridden: boolean;
    unit: string;
    units: string[];
    parentUnit: string;
  }
}

interface IntegerDefaultParameter {
  hidden: boolean;
  readonly: boolean;
  type: 'INTEGER_DEFAULT';
  default: {
    type: 'INTEGER';
    value: number;
    parentValue: number;
    overridden: boolean;
  }
}

interface IntegerAllParameter {
  hidden: boolean;
  readonly: boolean;
  type: 'INTEGER_ALL';
  default: {
    type: 'INTEGER';
    value: number;
    parentValue: number;
    overridden: boolean;
  }
  maximum: {
    type: 'INTEGER';
    value: number;
    parentValue: number;
    overriden: boolean
  }
  unlimited: {
    supported: boolean;
    value: boolean;
    parentValue: boolean;
  }
}

interface UnitSizeAllParameter {
  hidden: boolean;
  readonly: boolean;
  type: 'UNIT_SIZE_ALL';
  default: {
    type: 'UNIT_SIZE';
    value: number;
    parentValue: number;
    unit: string;
    parentUnit: string;
    units: string[];
    overridden: boolean;
  }
  maximum: {
    type: 'UNIT_SIZE';
    value: number;
    parentValue: number;
    unit: string;
    parentUnit: string;
    units: string[];
    overriden: boolean;
  }
  unlimited: {
    supported: boolean;
    value: boolean;
    parentValue: boolean;
  }
}

interface UnitSizeMaxParamter {
  hidden: boolean;
  readonly: boolean;
  type: 'UNIT_SIZE_MAX';
  maximum: {
    type: 'UNIT_SIZE';
    value: number;
    parentValue: number;
    unit: string;
    parentUnit: string;
    units: string[];
    overriden: boolean;
  }
  unlimited: {
    supported: boolean;
    value: boolean;
    parentValue: boolean;
  }
}

export interface Functionality {
  identifier: string;
  type: 'DEFAULT' | 'INTEGER' | 'STRING' | 'UNIT' | 'UNIT_SIZE' | 'UNIT_TIME' | 'BOOLEAN' | 'ENUM_LANG';
  parentIdentifier: string;
  hidden: boolean;
  readonly: boolean;
  domain: {
    uuid: string;
    name: string;
  };
  activationPolicy: Policy;
  configurationPolicy: Policy;
  delegationPolicy: Policy;
  parameter: StringParameter | BooleanParameter | UnitTimeAllParameter | UnitTimeDefaultParameter | IntegerDefaultParameter | IntegerAllParameter | UnitSizeAllParameter | UnitSizeMaxParamter;
}
