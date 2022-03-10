import dayjs from 'dayjs';

export function addTime(d: Date | number, amount: number, unit: string): Date {
  switch (unit.toLowerCase()) {
    case 'day':
      return dayjs(d).add(amount, 'day').toDate();
    case 'month':
      return dayjs(d).add(amount, 'month').toDate();
    case 'week':
      return dayjs(d).add(amount, 'week').toDate();
    default:
      return new Date(NaN);
  }
}

export function isAfter(d: Date | number, dateToCompare: Date | number): boolean {
  return dayjs(d).isAfter(dateToCompare);
}

export function isBefore(d: Date | number, dateToCompare: Date | number): boolean {
  return dayjs(d).isBefore(dateToCompare);
}

export function isValid(d: Date): boolean {
  return dayjs(d).isValid();
}
