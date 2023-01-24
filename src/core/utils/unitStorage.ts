interface StorageUnit {
  base: number;
  label: 'B' | 'KB' | 'MB' | 'GB' | 'TB' | 'PB' | 'EB';
}

export const STORAGE_UNITS: StorageUnit[] = [
  { base: 1, label: 'B' },
  { base: 1e3, label: 'KB' },
  { base: 1e6, label: 'MB' },
  { base: 1e9, label: 'GB' },
  { base: 1e12, label: 'TB' },
  { base: 1e15, label: 'PB' },
  { base: 1e18, label: 'EB' },
];

type ReadableSize = {
  value: number;
  unit: StorageUnit;
  getText: () => string;
};

function getReadableSize(bytes: number, decimals = 2): ReadableSize {
  let unit: StorageUnit = STORAGE_UNITS[0];
  let value: number;

  if (bytes < 0 || bytes === 0) {
    value = 0;
  } else {
    const unitIndex = Math.floor(Math.log(bytes) / Math.log(1000));

    value = +(bytes / STORAGE_UNITS[unitIndex].base).toFixed(decimals);
    unit = STORAGE_UNITS[unitIndex > 8 ? 8 : unitIndex];
  }

  return {
    value,
    unit,
    getText() {
      return `${value} ${unit.label}`;
    },
  };
}

function getSizeInUnit(bytes: number, unitLabel: StorageUnit['label'], decimals = 2): number {
  const unit = STORAGE_UNITS.find((unit) => unit.label === unitLabel);

  if (!unit) return NaN;

  return +(bytes / unit.base).toFixed(decimals);
}

const units = {
  B: {
    value: 'B',
    factor: 0,
  },
  KB: {
    value: 'KB',
    factor: 3,
  },
  MB: {
    value: 'MB',
    factor: 6,
  },
  GB: {
    value: 'GB',
    factor: 9,
  },
  TB: {
    value: 'TB',
    factor: 12,
  },
  PB: {
    value: 'PB',
    factor: 15,
  },
  EB: {
    value: 'EB',
    factor: 18,
  },
  ZB: {
    value: 'ZB',
    factor: 21,
  },
  YB: {
    value: 'YB',
    factor: 24,
  },
};

type multiple3 = {
  [propKey: number]: number;
};

type size = {
  [propKey: number]: string;
};

function find(value: number) {
  let length = value.toString().length;
  const multiple3: multiple3 = {
      1: 3,
      2: 3,
      4: 6,
      5: 6,
      7: 9,
      8: 9,
      10: 12,
      11: 12,
      13: 15,
      14: 15,
      16: 18,
      17: 18,
      19: 21,
      20: 21,
      22: 24,
      23: 24,
    },
    size: size = {
      3: units.B.value,
      6: units.KB.value,
      9: units.MB.value,
      12: units.GB.value,
      15: units.TB.value,
      18: units.PB.value,
      21: units.EB.value,
      24: units.ZB.value,
    };

  if (Object.prototype.hasOwnProperty.call(multiple3, length)) {
    length = multiple3[length];
  }

  if (Object.prototype.hasOwnProperty.call(size, length)) {
    return size[length];
  } else {
    return units.YB.value;
  }
}

function byteTo(value: number, selectedUnit: StorageUnit['label'] | undefined, showUnit: boolean) {
  let result = 0;
  if (value === undefined || value === null || isNaN(value)) {
    return result;
  }
  const unit = selectedUnit === undefined ? find(value) : selectedUnit;
  result = value / Math.pow(10, units[unit as StorageUnit['label']].factor);
  const newResult = result % 1 === 0 ? result : result.toFixed(2);
  return showUnit ? newResult + ' ' + unit : newResult;
}

function toByte(value: number, unit: StorageUnit['label'], showUnit: boolean) {
  let result = 0;
  if (value === undefined || value === null || isNaN(value)) {
    return result;
  }
  result = value * Math.pow(10, units[unit as StorageUnit['label']].factor);
  const newResult = result % 1 === 0 ? result : result.toFixed(2);
  return showUnit ? newResult + `${units.B}` : newResult;
}

export { getReadableSize, getSizeInUnit, byteTo, find, toByte };
