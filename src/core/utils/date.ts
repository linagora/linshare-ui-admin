import dayjs, { Dayjs } from 'dayjs';
import { TimePeriod } from '../types/TimePeriod';

function addTime(d: Date | number, amount: number, unit: string): Date {
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

function isAfter(d: Date | number, dateToCompare: Date | number): boolean {
  return dayjs(d).isAfter(dateToCompare);
}

function isBefore(d: Date | number, dateToCompare: Date | number): boolean {
  return dayjs(d).isBefore(dateToCompare);
}

function isValid(d: Date): boolean {
  return dayjs(d).isValid();
}

function getPeriodFromDate(beginDate: Dayjs | null, endDate: Dayjs | null): TimePeriod {
  if (!beginDate && !endDate) {
    return 'ALL_TIME';
  } else if (endDate?.diff(beginDate, 'day') === 1) {
    return 'LAST_DAY';
  } else if (endDate?.diff(beginDate, 'day') === 7) {
    return 'LAST_7_DAYS';
  } else if (endDate?.diff(beginDate, 'day') === 30) {
    return 'LAST_30_DAYS';
  } else if (endDate?.diff(beginDate, 'month') === 6) {
    return 'LAST_6_MONTHS';
  } else if (endDate?.diff(beginDate, 'year') === 1) {
    return 'LAST_YEAR';
  } else {
    return 'CUSTOM';
  }
}

function getDatesFromPeriod(option: TimePeriod): [Dayjs, Dayjs] | undefined {
  switch (option) {
    case 'LAST_DAY':
      return [dayjs().subtract(1, 'days'), dayjs()];
    case 'LAST_7_DAYS':
      return [dayjs().subtract(7, 'days'), dayjs()];
    case 'LAST_30_DAYS':
      return [dayjs().subtract(30, 'days'), dayjs()];
    case 'LAST_6_MONTHS':
      return [dayjs().subtract(6, 'months'), dayjs()];
    case 'LAST_YEAR':
      return [dayjs().subtract(1, 'year'), dayjs()];
    default:
      break;
  }
}

export { addTime, isAfter, isBefore, isValid, getPeriodFromDate, getDatesFromPeriod };
