<template>
  <div class="technical-account-detail-page">
    <a-tabs v-model:activeKey="activeKey">
      <a-tab-pane key="1" :tab="$t('TECHNICAL_ACCOUNTS.DETAIL_PAGE.USER_INFORMATIONS_TITLE')">
        <UserInformations />
      </a-tab-pane>
      <a-tab-pane key="2" :tab="$t('TECHNICAL_ACCOUNTS.DETAIL_PAGE.CHANGE_PASSWORD')"> <ChangePassword /></a-tab-pane>
    </a-tabs>
    <a-modal
      v-model:visible="modal.visible"
      :closable="false"
      :footer="null"
      wrap-class-name="technical-account-detail-page__modal"
      :destroy-on-close="true"
    >
      <DeleteTechnicalAccountCard v-if="modal.type === 'DELETE_TECHNICAL_ACCOUNT'" @close="onCloseModal">
      </DeleteTechnicalAccountCard>
    </a-modal>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, ref, onBeforeUnmount } from 'vue';
import useAdministrationPage from '@/core/hooks/useAdministrationPage';
import useTechnicalAccount from '../hooks/useTechnicalAccount';
import UserInformations from '../components/detail-page/user-informations.vue';
import ChangePassword from '../components/detail-page/change-password-tab.vue';
import DeleteTechnicalAccountCard from '../components/delete-technical-account-card.vue';
import { DeleteOutlined } from '@ant-design/icons-vue';
import { useI18n } from 'vue-i18n';

const activeKey = ref('1');
const { t } = useI18n();
const { setActions } = useAdministrationPage();
const { onShowDeleteTechnicalAccount, modal, onCloseModal } = useTechnicalAccount();

onMounted(() => {
  setActions([
    {
      label: t(`TECHNICAL_ACCOUNTS.DELETE_MODAL.DELETE_ACCOUNT`),
      class: 'ls-delete',
      icon: DeleteOutlined,
      action: () => {
        onShowDeleteTechnicalAccount();
      },
    },
  ]);
});
onBeforeUnmount(() => {
  setActions([]);
});
</script>
<style lang="less">
.ls-delete,
.ls-delete:hover {
  color: #ea3c3c;
  border-color: #ea3c3c;
}

.technical-account-detail-page {
  &__modal .ant-modal-content {
    background: #ffffff;
    box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.08), 0px 8px 8px rgba(0, 0, 0, 0.16);
    border-radius: 16px;
    overflow: hidden;
  }

  &__modal .ant-modal-body {
    padding: 0;
  }

  &__modal .ant-modal-content {
    background: #ffffff;
    box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.08), 0px 8px 8px rgba(0, 0, 0, 0.16);
    border-radius: 16px;
    overflow: hidden;
  }

  &__modal .ant-modal-body {
    padding: 0;
  }

  &__modal .ant-modal-content {
    background: #ffffff;
    box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.08), 0px 8px 8px rgba(0, 0, 0, 0.16);
    border-radius: 16px;
    overflow: hidden;
  }

  &__modal .ant-modal-body {
    padding: 0;
  }
}
</style>
