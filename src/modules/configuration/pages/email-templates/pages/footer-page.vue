<template>
  <div class="email-templates-footer-page">
    <a-alert closable class="email-templates-footer-page__help-text">
      <template #description>
        <div v-html="$t('EMAIL_TEMPLATES.EMAIL_FOOTER.HELP_TEXT')"></div>
      </template>
    </a-alert>
    <div class="email-templates-footer-page__action">
      <a-input
        v-model:value="filterText"
        :placeholder="$t('GENERAL.SEARCH_BY_NAME')"
        class="email-templates-footer-page__action-input"
      >
        <template #prefix>
          <SearchOutlined />
        </template>
      </a-input>
      <email-footer-actions @create="onCreateMailFooter"></email-footer-actions>
    </div>
    <email-footer-table :status="status" :items="templatesBySearch"></email-footer-table>
  </div>
  <a-modal
    v-model:visible="modal.visible"
    :closable="false"
    :footer="null"
    wrap-class-name="email-templates-footer-page__modal"
    :destroy-on-close="true"
  >
    <DeleteMailFooterCard
      v-if="modal.type === 'DELETE_FOOTER_EMAIL'"
      @close="onCloseModal"
      @refresh="onFetchEmailFooters"
    ></DeleteMailFooterCard>
    <DeleteMailFootersCard
      v-else-if="modal.type === 'DELETE_FOOTERS_EMAIL'"
      @close="onCloseModal"
      @refresh="onFetchEmailFooters"
    ></DeleteMailFootersCard>
    <DeleteMailFootersFailCard
      v-else-if="modal.type === 'DELETE_FOOTERS_FAIL_EMAIL'"
      @close="onCloseModal"
      @refresh="onFetchEmailFooters"
    ></DeleteMailFootersFailCard>
    <!-- <create-mail-footer-modal
      v-if="modal.type === 'CREATE_FOOTER_EMAIL'"
      @close="onCloseModal"
      @refresh="onFetchEmailFooters"
    ></create-mail-footer-modal>
    >-->
  </a-modal>
</template>
<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { useRoute } from 'vue-router';
import { computed, watch } from 'vue';
import { SearchOutlined } from '@ant-design/icons-vue';
import { useDomainStore } from '@/modules/domain/store';
import useEmailTemplatesFooter from '../hooks/useEmailTemplatesFooter';
import EmailFooterTable from '../components/email-footer/email-footer-table.vue';
import EmailFooterActions from '../components/email-footer/email-footer-actions.vue';
// import createMailFooterModal from '../components/email-footer/email-footer-creation-modal.vue';
import DeleteMailFooterCard from '../components/email-footer/delete-mail-footer-card.vue';
import DeleteMailFootersCard from '../components/email-footer/delete-mail-footers-card.vue';
import DeleteMailFootersFailCard from '../components/email-footer/delete-mail-footers-fail-card.vue';

//composable
const route = useRoute();
const { currentDomain } = storeToRefs(useDomainStore());
const {
  modal,
  status,
  list,
  filterText,
  onCreateMailFooter,
  onCloseModal,
  handleGetEmailFooterTemplates,
  resetSelectEmailFooters,
} = useEmailTemplatesFooter();

//computed

const templatesBySearch = computed(() => {
  if (!filterText.value) {
    return list.value;
  } else {
    return (
      list.value?.filter(
        (footer) =>
          footer.domain.toLowerCase().includes(filterText.value.toLowerCase()) ||
          footer.description?.toLowerCase().includes(filterText.value.toLowerCase())
      ) ?? []
    );
  }
});
const currentDomainUuid = computed(() => {
  return route.params.domainUuid.toString() ?? currentDomain.value.uuid;
});

// methods
async function onFetchEmailFooters() {
  await handleGetEmailFooterTemplates(currentDomainUuid.value, false);
  resetSelectEmailFooters();
}

watch(
  route,
  (newRoute) => {
    if (newRoute) {
      onFetchEmailFooters();
    }
  },
  {
    immediate: true,
  }
);
</script>
<style lang="less">
.email-templates-footer-page {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
  gap: 16px;

  &__help-text {
    padding: 12px 24px 12px 16px;
    gap: 6px;
    background: #f2f8ff;
    border-radius: 8px;
    border: none;

    ul {
      list-style: none;
    }

    ul li::before {
      content: '\2022';
      color: #007aff;
      font-weight: bold;
      display: inline-block;
      width: 1em;
      margin-left: -1em;
    }
  }

  &__action {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: center;
    gap: 24px;
  }

  &__action-input {
    width: 375px;
  }

  &__action-switch {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    white-space: nowrap;
    gap: 4px;
    font-size: 16px;
    line-height: 20px;
    letter-spacing: -0.02em;
    color: #434657;
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
.ls-detail {
  width: 32px;
  height: 32px;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f2f8ff;
  border: 1px solid #a3dcff;
  color: #007aff;
  border-radius: 7px;
  transform: rotate(90deg);
}
</style>
