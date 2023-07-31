<template>
  <div class="email-templates-content-page">
    <a-alert closable class="email-templates-content-page__help-text">
      <template #description>
        <ul>
          <li v-html="$t('EMAIL_TEMPLATES.EMAIL_CONTENT.FIRST_HELP_TEXT')"></li>
          <li v-html="$t('EMAIL_TEMPLATES.EMAIL_CONTENT.SECOND_HELP_TEXT')"></li>
          <li v-html="$t('EMAIL_TEMPLATES.EMAIL_CONTENT.THIRD_HELP_TEXT')"></li>
        </ul>
      </template>
    </a-alert>
    <div class="email-templates-content-page__action">
      <a-input
        v-model:value="filterText"
        :placeholder="$t('GENERAL.SEARCH_BY_NAME')"
        class="email-templates-content-page__action-input"
      >
        <template #prefix>
          <SearchOutlined />
        </template>
      </a-input>
      <email-content-actions @create="onCreateMailContent"></email-content-actions>
    </div>
    <email-content-table :status="status" :items="templatesBySearch"></email-content-table>
  </div>
  <a-modal
    v-model:visible="modal.visible"
    :closable="false"
    :footer="null"
    wrap-class-name="email-templates-content-page__modal"
    :destroy-on-close="true"
  >
    <DeleteMailContentCard
      v-if="modal.type === 'DELETE_CONTENT_EMAIL'"
      @close="onCloseModal"
      @refresh="onFetchEmailContents"
    ></DeleteMailContentCard>
    <!-- <DeleteMailContentsCard
      v-else-if="modal.type === 'DELETE_CONTENTS_EMAIL'"
      @close="onCloseModal"
      @refresh="onFetchEmailContents"
    ></DeleteMailContentsCard>
    <DeleteMailContentsFailCard
      v-else-if="modal.type === 'DELETE_CONTENTS_FAIL_EMAIL'"
      @close="onCloseModal"
      @refresh="onFetchEmailContents"
    ></DeleteMailContentsFailCard>
    <create-mail-content-card
      v-if="modal.type === 'CREATE_CONTENT_EMAIL'"
      @close="onCloseModal"
      @refresh="onFetchEmailContents"
    ></create-mail-content-card> -->
  </a-modal>
</template>
<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { useRoute } from 'vue-router';
import { computed, watch } from 'vue';
import { SearchOutlined } from '@ant-design/icons-vue';
import { useDomainStore } from '@/modules/domain/store';
import useEmailTemplatesContent from '@/modules/configuration/pages/email-templates/hooks/useEmailTemplatesContent';
import EmailContentTable from '@/modules/configuration/pages/email-templates/components/email-content/email-content-table.vue';
import EmailContentActions from '@/modules/configuration/pages/email-templates/components/email-content/email-content-actions.vue';
// import CreateMailContentCard from '@/modules/configuration/pages/email-templates/components/email-content/create-mail-content-card.vue';
import DeleteMailContentCard from '@/modules/configuration/pages/email-templates/components/email-content/delete-mail-content-card.vue';
// import DeleteMailContentsCard from '@/modules/configuration/pages/email-templates/components/email-content/delete-mail-contents-card.vue';
// import DeleteMailContentsFailCard from '@/modules/configuration/pages/email-templates/components/email-content/delete-mail-contents-fail-card.vue';

//composable
const route = useRoute();
const { currentDomain } = storeToRefs(useDomainStore());
const {
  modal,
  status,
  list,
  filterText,
  onCreateMailContent,
  onCloseModal,
  handleGetEmailContentTemplates,
  resetSelectEmailContents,
} = useEmailTemplatesContent();

//computed

const templatesBySearch = computed(() => {
  if (!filterText.value) {
    return list.value;
  } else {
    return (
      list.value?.filter(
        (content) =>
          content.domain.toLowerCase().includes(filterText.value.toLowerCase()) ||
          content.description?.toLowerCase().includes(filterText.value.toLowerCase())
      ) ?? []
    );
  }
});
const currentDomainUuid = computed(() => {
  return route.params.domainUuid.toString() ?? currentDomain.value.uuid;
});

// methods
async function onFetchEmailContents() {
  await handleGetEmailContentTemplates(currentDomainUuid.value, false);
  resetSelectEmailContents();
}

watch(
  route,
  (newRoute) => {
    if (newRoute) {
      onFetchEmailContents();
    }
  },
  {
    immediate: true,
  }
);
</script>
<style lang="less">
.email-templates-content-page {
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
