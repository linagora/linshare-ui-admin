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

export { getReadableSize, getSizeInUnit };
