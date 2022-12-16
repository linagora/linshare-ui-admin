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
  defaut: BooleanParameterValue;
}

interface StringParameter {
  hidden: boolean;
  readonly: boolean;
  type: 'STRING';
  defaut: StringParameterValue;
}

interface UnitTimeAllParameter {
  hidden: boolean;
  readonly: boolean;
  type: 'UNIT_TIME_ALL';
  defaut: UnitTimeParameterValue;
  maximum: UnitTimeParameterValue;
  unlimited: ParameterUnlimited;
}

interface UnitTimeDefaultParameter {
  hidden: boolean;
  type: 'UNIT_TIME_DEFAULT';
  readonly: boolean;
  defaut: UnitTimeParameterValue;
}

interface IntegerDefaultParameter {
  hidden: boolean;
  readonly: boolean;
  type: 'INTEGER_DEFAULT';
  defaut: IntegerParameterValue;
}

interface IntegerAllParameter {
  hidden: boolean;
  readonly: boolean;
  type: 'INTEGER_ALL';
  defaut: IntegerParameterValue;
  maximum: IntegerParameterValue;
  unlimited: ParameterUnlimited;
}

interface UnitSizeAllParameter {
  hidden: boolean;
  readonly: boolean;
  type: 'UNIT_SIZE_ALL';
  defaut: UnitSizeParameterValue;
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

interface IntegerMaxParameter {
  type: 'INTEGER_MAX';
  hidden: boolean;
  readonly: boolean;
  maximum: IntegerParameterValue;
  unlimited: ParameterUnlimited;
}

interface EnumLanguageParameter {
  type: 'LANGUAGE';
  hidden: boolean;
  readonly: boolean;
  defaut: {
    type: string;
    value: string;
    parentValue: string;
    languages: string[];
  };
}

type FunctionalityParameter =
  | StringParameter
  | BooleanParameter
  | UnitTimeAllParameter
  | UnitTimeDefaultParameter
  | IntegerDefaultParameter
  | IntegerAllParameter
  | UnitSizeAllParameter
  | EnumLanguageParameter
  | IntegerMaxParameter
  | UnitSizeMaxParamter;

export interface Functionality {
  identifier: string;
  type: 'DEFAULT' | 'INTEGER' | 'STRING' | 'UNIT' | 'UNIT_SIZE' | 'UNIT_TIME' | 'BOOLEAN' | 'ENUM_LANG';
  parentIdentifier?: string;
  hidden: boolean;
  readonly: boolean;
  domain: {
    uuid: string;
    name: string;
  };
  activationPolicy: FunctionalityPolicy;
  configurationPolicy: FunctionalityPolicy;
  delegationPolicy: FunctionalityPolicy;
  parameter?: FunctionalityParameter;
}
