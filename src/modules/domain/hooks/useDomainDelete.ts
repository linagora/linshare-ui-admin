import { APIError } from '@/core/types/APIError';
import { ACCOUNT_ROLE } from '@/modules/user/types/User';
import { message, Modal } from 'ant-design-vue';
import { computed, ComputedRef, createVNode, Ref, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useDomainStore } from '@/modules/domain/store';
import { useAuthStore } from '@/modules/auth/store';
import { DOMAIN_TYPE } from '../types/Domain';
import DomainTreeNode from '../types/DomainTreeNode';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { storeToRefs } from 'pinia';

type UsableDomainDelete = {
  canDelete: ComputedRef<boolean>;
  confirmThenDelete: () => void;
  deleteDomain: () => Promise<void>;
  deleting: Ref<boolean>;
};

export default function useDomainDelete(): UsableDomainDelete {
  const domainStore = useDomainStore();
  const authStore = useAuthStore();
  const { t } = useI18n();
  const deleting = ref(false);
  const { currentDomain } = storeToRefs(domainStore);
  const { loggedUser } = storeToRefs(authStore);
  const canDelete = computed(
    () => loggedUser.value?.role === ACCOUNT_ROLE.SUPERADMIN && currentDomain.value.type !== DOMAIN_TYPE.ROOT
  );

  function confirmThenDelete() {
    let childDomainExists = false;

    if (currentDomain.value.type === DOMAIN_TYPE.TOP) {
      const domainNode: DomainTreeNode = domainStore.getDomainByUuid(currentDomain.value.uuid);

      childDomainExists = !!domainNode.children?.length;
    }

    if (childDomainExists) {
      Modal.warning({
        title: () => t('DOMAIN.DELETE.MODAL_CHILD_EXISTS_TITLE'),
        content: () => t('DOMAIN.DELETE.MODAL_CHILD_EXISTS_TEXT'),
      });

      return;
    }

    Modal.confirm({
      icon: () => createVNode(ExclamationCircleOutlined),
      title: () => t('DOMAIN.DELETE.MODAL_CONFIRM_TITLE'),
      content: () => t('DOMAIN.DELETE.MODAL_CONFIRM_TEXT'),
      okText: () => t('GENERAL.YES'),
      cancelText: () => t('GENERAL.NO'),
      onOk: deleteDomain,
    });
  }

  async function deleteDomain() {
    deleting.value = true;

    try {
      await domainStore.deleteCurrentDomain();
    } catch (error) {
      if (error instanceof APIError) {
        message.error(error.getMessage());
      } else {
        console.error(error);
      }
    } finally {
      deleting.value = false;
    }
  }

  return {
    canDelete,
    confirmThenDelete,
    deleteDomain,
    deleting,
  };
}
