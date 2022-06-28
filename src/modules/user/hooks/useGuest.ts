import { addTime, isAfter, isBefore, isValid } from '@/core/utils/date';
import { getMaximumParameter } from '@/core/utils/functionality';
import { computed, ComputedRef } from 'vue';
import { useDomainStore } from '@/modules/domain/store';
import { useUserStore } from '@/modules/user/store';
import { storeToRefs } from 'pinia';
import { useAuthStore } from '@/modules/auth/store';

type UsableGuest = {
  maxExpirationDate: ComputedRef<Date>;
  isCurrentUserGuest: ComputedRef<boolean>;
  isValidExpirationDate: (date: Date | number) => boolean;
};

export function useGuest(): UsableGuest {
  const authStore = useAuthStore();
  const userStore = useUserStore();
  const { user } = storeToRefs(userStore);
  const { functionalities } = storeToRefs(authStore);
  const isCurrentUserGuest = computed(() => user.value?.accountType === 'GUEST');

  const maxExpirationDate = computed<Date>(() => {
    if (!isCurrentUserGuest.value || !user.value) {
      return new Date(NaN);
    }

    const max = getMaximumParameter(functionalities.value.GUESTS__EXPIRATION);

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
