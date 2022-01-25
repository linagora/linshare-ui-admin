import { Functionality } from '../types/Functionality';

export function getMaximumParameter (functionality: Functionality) {
  const parameter = functionality.parameter;

  switch (parameter.type) {
    case 'UNIT_SIZE_ALL':
    case 'UNIT_TIME_ALL':
    case 'INTEGER_ALL':
      return parameter.maximum;

    default:
      return null;
  }
}

export function isEnable (functionality: Functionality): boolean {
  return functionality.activationPolicy.enable.value;
}
