import { computed, watchEffect } from 'vue';
import { useI18n } from 'vue-i18n';
import { storeToRefs } from 'pinia';
import { useAuthStore } from '@/modules/auth/store';
import { useDomainStore } from '@/modules/domain/store';
import { useRouter } from 'vue-router';
import { Modal } from 'ant-design-vue';
import { isEnable } from '@/core/utils/functionality';

export default function use2FARequiredCheck(): void {
  const authStore = useAuthStore();
  const domainStore = useDomainStore();
  const { push, currentRoute } = useRouter();
  const { t } = useI18n();
  const { secondFA } = storeToRefs(authStore);
  const secondFAEnabled = computed(() => {
    const functionality = domainStore.getLoggedUserFunctionality('SECOND_FACTOR_AUTHENTICATION');

    return isEnable(functionality);
  });

  watchEffect(() => {
    if (
      secondFAEnabled.value &&
      !secondFA.value?.enabled &&
      secondFA.value?.required &&
      currentRoute.value.name !== 'ManageSecondFactorAuthentication' &&
      currentRoute.value.meta.requiresAuth
    ) {
      Modal.info({
        keyboard: false,
        title: () => t('2FA.KEY_CREATION.FORCE_CREATION_MODAL.TITLE'),
        content: () => t('2FA.KEY_CREATION.FORCE_CREATION_MODAL.MESSAGE'),
        okText: () => t('2FA.KEY_CREATION.FORCE_CREATION_MODAL.OK_BUTTON'),
        onOk: () => push({ name: 'ManageSecondFactorAuthentication' }),
      });
    }
  });
}
