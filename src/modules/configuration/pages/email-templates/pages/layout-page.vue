<template>
  <div class="email-templates-layout-page">
    <a-alert closable class="email-templates-layout-page__help-text">
      <template #description>
        <ul>
          <li v-html="$t('EMAIL_TEMPLATES.EMAIL_LAYOUT.FIRST_HELP_TEXT')"></li>
          <li v-html="$t('EMAIL_TEMPLATES.EMAIL_LAYOUT.SECOND_HELP_TEXT')"></li>
          <li v-html="$t('EMAIL_TEMPLATES.EMAIL_LAYOUT.THIRD_HELP_TEXT')"></li>
          <li v-html="$t('EMAIL_TEMPLATES.EMAIL_LAYOUT.FOUR_HELP_TEXT')"></li>
          <li v-html="$t('EMAIL_TEMPLATES.EMAIL_LAYOUT.FIVE_HELP_TEXT')"></li>
          <li v-html="$t('EMAIL_TEMPLATES.EMAIL_LAYOUT.SIX_HELP_TEXT')"></li>
        </ul>
      </template>
    </a-alert>
    <div class="email-templates-layout-page__action">
      <a-input
        v-model:value="filterText"
        :placeholder="$t('GENERAL.SEARCH_BY_NAME')"
        class="email-templates-layout-page__action-input"
      >
        <template #prefix>
          <SearchOutlined />
        </template>
      </a-input>
      <mail-layout-actions @create="onCreateMailLayout"></mail-layout-actions>
    </div>
    <email-layout-table :status="status" :items="templatesBySearch"></email-layout-table>
  </div>
  <a-modal
    v-model:visible="modal.visible"
    :closable="false"
    :footer="null"
    wrap-class-name="email-templates-layout-page__modal"
    :destroy-on-close="true"
  >
    <create-mail-layout-modal
      v-if="modal.type === 'CREATE_LAYOUT_EMAIL'"
      @close="onCloseModal"
      @refresh="onFetchEmailLayouts"
    ></create-mail-layout-modal>
    >
    <DeleteMailLayoutCard
      v-if="modal.type === 'DELETE_LAYOUT_EMAIL'"
      @close="onCloseModal"
      @refresh="onFetchEmailLayouts"
    ></DeleteMailLayoutCard>
    <DeleteMailLayoutsCard
      v-else-if="modal.type === 'DELETE_LAYOUTS_EMAIL'"
      @close="onCloseModal"
      @refresh="onFetchEmailLayouts"
    ></DeleteMailLayoutsCard>
    <DeleteMailLayoutsFailCard
      v-else-if="modal.type === 'DELETE_LAYOUTS_FAIL_EMAIL'"
      @close="onCloseModal"
      @refresh="onFetchEmailLayouts"
    ></DeleteMailLayoutsFailCard>
  </a-modal>
</template>
<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { useRoute } from 'vue-router';
import { computed, watch } from 'vue';
import { SearchOutlined } from '@ant-design/icons-vue';
import { useDomainStore } from '@/modules/domain/store';
import useEmailTemplatesLayout from '../hooks/useEmailTemplatesLayout';
import EmailLayoutTable from '../components/email-layout/email-layout-table.vue';
import createMailLayoutModal from '../components/email-layout/email-layout-creation-modal.vue';
import MailLayoutActions from '../components/email-layout/mail-layout-actions.vue';
import DeleteMailLayoutCard from '../components/email-layout/delete-mail-layout-card.vue';
import DeleteMailLayoutsCard from '../components/email-layout/delete-mail-layouts-card.vue';
import DeleteMailLayoutsFailCard from '../components/email-layout/delete-mail-layouts-fail-card.vue';

//composable
const route = useRoute();
const { currentDomain } = storeToRefs(useDomainStore());
const { modal, status, list, filterText, onCreateMailLayout, onCloseModal, handleGetEmailLayoutTemplates } =
  useEmailTemplatesLayout();

//computed

const templatesBySearch = computed(() => {
  if (!filterText.value) {
    return list.value;
  } else {
    return (
      list.value?.filter(
        (layout) =>
          layout.domain.toLowerCase().includes(filterText.value.toLowerCase()) ||
          layout.description?.toLowerCase().includes(filterText.value.toLowerCase())
      ) ?? []
    );
  }
});
const currentDomainUuid = computed(() => {
  return route.params.domainUuid.toString() ?? currentDomain.value.uuid;
});

// methods
async function onFetchEmailLayouts() {
  await handleGetEmailLayoutTemplates(currentDomainUuid.value);
}

function openCreateModal() {
  modal.visible = true;
}
watch(
  route,
  (newRoute) => {
    if (newRoute) {
      onFetchEmailLayouts();
    }
  },
  {
    immediate: true,
  }
);
</script>
<style lang="less">
.email-templates-layout-page {
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
