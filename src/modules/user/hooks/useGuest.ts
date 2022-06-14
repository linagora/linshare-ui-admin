import { addTime, isAfter, isBefore, isValid } from '@/core/utils/date';
import { getMaximumParameter } from '@/core/utils/functionality';
import { computed, ComputedRef } from 'vue';
import { useDomainStore } from '@/modules/domain/store';
import { useUserStore } from '@/modules/user/store';
import { storeToRefs } from 'pinia';

type UsableGuest = {
  maxExpirationDate: ComputedRef<Date>;
  isCurrentUserGuest: ComputedRef<boolean>;
  isValidExpirationDate: (date: Date | number) => boolean;
};

export function useGuest(): UsableGuest {
  const domainStore = useDomainStore();
  const userStore = useUserStore();
  const { user } = storeToRefs(userStore);
  const isCurrentUserGuest = computed(() => user.value?.accountType === 'GUEST');
  const guestExpiration = computed(() => domainStore.getLoggedUserFunctionality('GUESTS__EXPIRATION'));

  const maxExpirationDate = computed<Date>(() => {
    if (!isCurrentUserGuest.value || !user.value) {
      return new Date(NaN);
    }

    const max = getMaximumParameter(guestExpiration.value);

    if (max?.type !== 'UNIT_TIME') {
      return new Date(NaN);
    }

    return addTime(user.value.creationDate, max.value, max.unit);
  });

  function isValidExpirationDate(date: Date | number): boolean {
    if (isBefore(date, new Date())) {
      return false;
    }

    if (maxExpirationDate.value && isValid(maxExpirationDate.value) && isAfter(date, maxExpirationDate.value)) {
      return false;
    }

    return true;
  }

  return {
    maxExpirationDate,
    isCurrentUserGuest,
    isValidExpirationDate,
  };
}
