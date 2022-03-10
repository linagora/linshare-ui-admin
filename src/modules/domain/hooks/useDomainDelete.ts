import { APIError } from '@/core/types/APIError';
import { ACCOUNT_ROLE } from '@/modules/user/types/User';
import { message, Modal } from 'ant-design-vue';
import { computed, ComputedRef, createVNode, Ref, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';
import Domain, { DOMAIN_TYPE } from '../types/Domain';
import DomainTreeNode from '../types/DomainTreeNode';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';

type UsableDomainDelete = {
  canDelete: ComputedRef<boolean>;
  confirmThenDelete: () => void;
  deleteDomain: () => Promise<void>;
  deleting: Ref<boolean>;
};

export default function useDomainDelete(): UsableDomainDelete {
  const store = useStore();
  const { t } = useI18n();
  const deleting = ref(false);
  const currentDomain = computed<Domain>(() => store.getters['Domain/getCurrentDomain']);
  const loggedUserRole = computed<ACCOUNT_ROLE>(() => store.getters['Auth/getLoggedUserRole']);
  const canDelete = computed(
    () => loggedUserRole.value === ACCOUNT_ROLE.SUPERADMIN && currentDomain.value.type !== DOMAIN_TYPE.ROOT
  );

  function confirmThenDelete() {
    let childDomainExists = false;

    if (currentDomain.value.type === DOMAIN_TYPE.TOP) {
      const domainNode: DomainTreeNode = store.getters['Domain/getDomainByUuid'](currentDomain.value.uuid);

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
      await store.dispatch('Domain/deleteCurrentDomain');
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
