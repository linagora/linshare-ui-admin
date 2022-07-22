import { addTime, isAfter, isBefore, isValid } from '@/core/utils/date';
import { getMaximumParameter } from '@/core/utils/functionality';
import { storeToRefs } from 'pinia';
import { useAuthStore } from '@/modules/auth/store';
import User from '../types/User';

type UsableGuest = {
  getMaxExpirationDate: (user: User) => Date;
  isValidExpirationDate: (user: User, date: Date) => boolean;
};

export function useGuest(): UsableGuest {
  const authStore = useAuthStore();
  const { functionalities } = storeToRefs(authStore);

  function getMaxExpirationDate(guest: User): Date {
    const max = getMaximumParameter(functionalities.value.GUESTS__EXPIRATION);

    if (max?.type !== 'UNIT_TIME') {
      return new Date(NaN);
    }

    return addTime(guest.creationDate, max.value, max.unit);
  }

  function isValidExpirationDate(guest: User, date: Date | number): boolean {
    const maxExpirationDate = getMaxExpirationDate(guest);

    if (isBefore(date, new Date())) {
      return false;
    }

    if (maxExpirationDate && isValid(maxExpirationDate) && isAfter(date, maxExpirationDate)) {
      return false;
    }

    return true;
  }

  return {
    getMaxExpirationDate,
    isValidExpirationDate,
  };
}
