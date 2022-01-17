import { Functionality } from '@/core/types/Functionality';
import { addTime, isAfter, isBefore } from '@/core/utils/date';
import { getMaximumParameter } from '@/core/utils/functionality';
import { computed } from 'vue';
import { useStore } from 'vuex';
import User from '../types/User';

export function useGuest () {
  const store = useStore();
  const user = computed<User>(() => store.getters['User/getUser']);
  const isCurrentUserGuest = computed(() => user.value.accountType === 'GUEST');
  const guestExpiration: Functionality = store.getters['Domain/getLoggedUserFunctionality']('GUESTS__EXPIRATION');

  const maxExpirationDate = computed<Date>(() => {
    if (!isCurrentUserGuest.value) {
      return new Date(NaN);
    }

    const max = getMaximumParameter(guestExpiration);

    if (max?.type !== 'UNIT_TIME') {
      return new Date(NaN);
    }

    return addTime(user.value.creationDate, max.value, max.unit);
  });

  function isValidExpirationDate (date: Date | number) : boolean {
    if (isBefore(date, new Date())) {
      return false;
    }

    if (maxExpirationDate.value && isAfter(date, maxExpirationDate.value)) {
      return false;
    }

    return true;
  }

  return {
    maxExpirationDate,
    isCurrentUserGuest,
    isValidExpirationDate
  };
}
