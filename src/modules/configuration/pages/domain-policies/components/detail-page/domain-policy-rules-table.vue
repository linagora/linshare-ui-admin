<template>
  <div class="domain-policy-rules-table">
    <span class="title">
      {{ $t('DOMAIN_POLICY.RULES_LIST') }}
    </span>
    <a-table
      key="uuid"
      class="domain-policy-rules-table__table"
      :columns="columns"
      :pagination="false"
      :data-source="rulesByPage"
      row-key="uuid"
      :loading="status === STATUS.LOADING"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'position'">
          <div class="positon">
            <a-button class="ls-button ls-position-button">
              <UpOutlined />
            </a-button>
            <a-button class="ls-button ls-position-button">
              <DownOutlined />
            </a-button>
          </div>
        </template>
        <template v-if="column.key === 'domain'">
          <span class="elipsis-name">{{ record?.domain?.label }}</span>
        </template>
        <template v-if="column.key === 'type'">
          <CheckOutlined v-if="record?.type === 'ALLOW' || record?.type === 'ALLOW_ALL'" class="type-allow" />
          <CloseOutlined v-else class="type-deny" />
        </template>
        <template v-if="column.key === 'actions'">
          <a-button class="ls-button ls-position-button">
            <DeleteFilled class="type-deny" />
          </a-button>
        </template>
      </template>
    </a-table>
  </div>
</template>
<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { STATUS } from '@/core/types/Status';
import { computed } from 'vue';
import { DomainPolicyRule } from '../../types/DomainPolicy';
import useDomainPolicies from '../../hooks/useDomainPolicies';
import { CheckOutlined, CloseOutlined, UpOutlined, DownOutlined, DeleteFilled } from '@ant-design/icons-vue';

const { t } = useI18n();
const { status, activeDomainPolicy } = useDomainPolicies();

// props & emits
const props = defineProps<{
  editable?: boolean;
  editing?: boolean;
}>();

// computed
const columns = computed(() => [
  {
    width: '15%',
    title: t('DOMAIN_POLICY.POSITION'),
    key: 'position',
  },
  {
    width: '45%',
    title: t('DOMAIN_POLICY.DOMAIN'),
    sorter: (a: DomainPolicyRule, b: DomainPolicyRule) => a?.domain?.label?.localeCompare(b?.domain?.label || ''),
    key: 'domain',
  },
  {
    width: '30%',
    title: t('DOMAIN_POLICY.TYPE'),
    sorter: (a: DomainPolicyRule, b: DomainPolicyRule) => a.type.localeCompare(b.type),
    key: 'type',
  },
  {
    width: '10%',
    title: t('DOMAIN_POLICY.ACTIONS'),
    key: 'actions',
  },
]);
const rulesByPage = computed(() => {
  return activeDomainPolicy.value.accessPolicy.rules;
});
</script>

<style lang="less">
.domain-policy-rules-table {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
  gap: 14px;
  width: 100%;
  max-width: 100%;

  .title {
    color: #000;
    /* Desktop/Subtitle 4 - Medium */
    font-family: Inter;
    font-size: 15px;
    font-style: normal;
    font-weight: 500;
    line-height: 20px; /* 133.333% */
  }

  &__table .ant-table {
    border: 1px solid #f0f0f0;
    border-radius: 8px;
    overflow: hidden;
    max-width: 100%;

    td:nth-child(1),
    th:nth-child(1) {
      max-width: 20vw;
    }
    td:nth-child(2),
    th:nth-child(2) {
      max-width: 20vw;
    }
    td:nth-child(3),
    th:nth-child(3) {
      max-width: 30vw;
    }
  }

  .ant-table-container,
  .ant-table-content {
    width: 100%;
  }

  .ant-table-content {
    overflow-x: scroll;
  }

  .ls-input {
    height: 44px;
    background: #fff;
    border: 1px solid #e4e5f0;
    border-radius: 10px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
  }

  .ls-input .ant-select-dropdown {
    top: 0 !important;
    bottom: auto !important;
  }

  &__dropdown {
    background-color: transparent !important;
    box-shadow: none !important;

    .ant-dropdown-menu {
      padding: 8px;
      gap: 8px;
      height: 164px;
      background: #ffffff;
      box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.08), 0px 8px 24px rgba(0, 0, 0, 0.08);
      border-radius: 8px;
    }

    .ant-dropdown-menu-item {
      height: 48px;
      border-radius: 8px;
      font-weight: 400;
      font-size: 16px;
      line-height: 20px;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      letter-spacing: -0.02em;
    }

    .ant-dropdown-menu-title-content {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      gap: 16px;
    }

    svg {
      color: #007aff;
    }

    .delete svg {
      color: #ea3c3c;
    }

    .ant-dropdown-menu-item:hover {
      color: #007aff;
    }
  }
  .positon {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: 4px;
  }
  .ls-position-button {
    height: 32px !important;
    width: 32px !important;
    color: #007aff;
    font-size: 14px;
  }
  .type-allow {
    color: #30cd60;
  }
  .type-deny {
    color: #ea3c3c;
  }
}
</style>
