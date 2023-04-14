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
      <a-button type="primary" class="ls-filled">
        <template #icon>
          <PlusCircleOutlined />
        </template>
        {{ $t('GENERAL.CREATE') }}
      </a-button>
    </div>
    <email-layout-table :status="status" :items="templatesBySearch"></email-layout-table>
  </div>
</template>
<script lang="ts" setup>
import { computed, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useRoute } from 'vue-router';
import { useDomainStore } from '@/modules/domain/store';
import useEmailTemplatesLayout from '../hooks/useEmailTemplatesLayout';
import EmailLayoutTable from '../components/email-layout/email-layout-table.vue';
import { PlusCircleOutlined, SearchOutlined } from '@ant-design/icons-vue';

//composable
const route = useRoute();
const { currentDomain } = storeToRefs(useDomainStore());
const { status, list, filterText, handleGetEmailLayoutTemplates } = useEmailTemplatesLayout();

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
async function onFetchMimePolicies() {
  await handleGetEmailLayoutTemplates(currentDomainUuid.value);
}

watch(
  route,
  (newRoute) => {
    if (newRoute) {
      onFetchMimePolicies();
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
}
</style>
