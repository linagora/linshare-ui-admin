interface Config {
  value: boolean;
  parentValue: boolean;
  overriden: boolean;
}

interface FunctionalityPolicy {
  hidden: boolean;
  readonly: boolean;
  enable: Config;
  allowOverride: Config;
}

interface ParameterValue<Type> {
  type: 'BOOLEAN' | 'STRING' | 'UNIT_TIME' | 'UNIT_SIZE' | 'INTEGER';
  value: Type;
  parentValue: Type;
  overriden: boolean;
}

interface ParameterValueWithUnits<Type> extends ParameterValue<Type> {
  unit: string;
  units: string[];
  parentUnit: string;
}

export interface BooleanParameterValue extends ParameterValue<boolean> {
  type: 'BOOLEAN';
}

export interface StringParameterValue extends ParameterValue<string> {
  type: 'STRING';
}

export interface UnitTimeParameterValue extends ParameterValueWithUnits<number> {
  type: 'UNIT_TIME';
}

export interface UnitSizeParameterValue extends ParameterValueWithUnits<number> {
  type: 'UNIT_SIZE';
}

export interface IntegerParameterValue extends ParameterValue<number> {
  type: 'INTEGER';
}

export interface ParameterUnlimited {
  supported: boolean;
  value: boolean;
  parentValue: boolean;
}

interface BooleanParameter {
  hidden: boolean;
  readonly: boolean;
  type: 'BOOLEAN';
  default: BooleanParameterValue;
}

interface StringParameter {
  hidden: boolean;
  readonly: boolean;
  type: 'STRING';
  default: StringParameterValue;
}

interface UnitTimeAllParameter {
  hidden: boolean;
  readonly: boolean;
  type: 'UNIT_TIME_ALL';
  default: UnitTimeParameterValue;
  maximum: UnitTimeParameterValue;
  unlimited: ParameterUnlimited;
}

interface UnitTimeDefaultParameter {
  hidden: boolean;
  type: 'UNIT_TIME_DEFAULT';
  readonly: boolean;
  default: UnitTimeParameterValue;
}

interface IntegerDefaultParameter {
  hidden: boolean;
  readonly: boolean;
  type: 'INTEGER_DEFAULT';
  default: IntegerParameterValue;
}

interface IntegerAllParameter {
  hidden: boolean;
  readonly: boolean;
  type: 'INTEGER_ALL';
  default: IntegerParameterValue;
  maximum: IntegerParameterValue;
  unlimited: ParameterUnlimited;
}

interface UnitSizeAllParameter {
  hidden: boolean;
  readonly: boolean;
  type: 'UNIT_SIZE_ALL';
  default: UnitSizeParameterValue;
  maximum: UnitSizeParameterValue;
  unlimited: ParameterUnlimited;
}

interface UnitSizeMaxParamter {
  hidden: boolean;
  readonly: boolean;
  type: 'UNIT_SIZE_MAX';
  maximum: UnitSizeParameterValue;
  unlimited: ParameterUnlimited;
}

type FunctionalityParameter =
  | StringParameter
  | BooleanParameter
  | UnitTimeAllParameter
  | UnitTimeDefaultParameter
  | IntegerDefaultParameter
  | IntegerAllParameter
  | UnitSizeAllParameter
  | UnitSizeMaxParamter;

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
  activationPolicy: FunctionalityPolicy;
  configurationPolicy: FunctionalityPolicy;
  delegationPolicy: FunctionalityPolicy;
  parameter: FunctionalityParameter;
}
