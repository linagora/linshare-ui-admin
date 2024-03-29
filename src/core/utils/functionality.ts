import {
  Functionality,
  UnitSizeParameterValue,
  UnitTimeParameterValue,
  IntegerParameterValue,
} from '../types/Functionality';

export function getMaximumParameter(
  functionality: Functionality | undefined
): UnitSizeParameterValue | UnitTimeParameterValue | IntegerParameterValue | null {
  if (!functionality) {
    return null;
  }

  const parameter = functionality.parameter;

  switch (parameter?.type) {
    case 'UNIT_SIZE_ALL':
    case 'UNIT_TIME_ALL':
    case 'INTEGER_ALL':
      return parameter.maximum;

    default:
      return null;
  }
}

export function isEnable(functionality: Functionality | undefined): boolean {
  if (!functionality) {
    return false;
  }
  return functionality?.activationPolicy.enable.value;
}
