<template>
  <div class="domain-policy-rules-table">
    <span class="title">
      {{ $t('DOMAIN_POLICY.RULES_LIST') }}
    </span>
    <div v-if="editing" class="domain-policy-rules-table__rule-form">
      <a-form-item style="width: 100px" class="ls-form-title" :label="$t('DOMAIN_POLICY.CREATE_MODAL.TYPE')">
        <a-select v-model:value="selectRule.rule" class="ls-input" :bordered="false" @select="onSelectRule">
          <a-select-option v-for="s in rules" :key="s.value" :value="s.value">
            {{ s.label }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item style="width: 300px" class="ls-form-title" :label="$t('DOMAIN_POLICY.CREATE_MODAL.SELECT_DOMAIN')">
        <a-select
          v-model:value="selectRule.domainId"
          class="ls-input"
          :disabled="isAllRule"
          :bordered="false"
          @select="onSelectDomain"
        >
          <a-select-option v-for="s in domains" :key="s" :value="s.value">
            {{ s.label }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-button :disabled="!editing || !editable" class="ls-button ls-add" @click="onAddRule">
        <PlusOutlined />
        {{ $t('DOMAIN_POLICY.CREATE_MODAL.ADD') }}
      </a-button>
    </div>
    <a-table
      key="uuid"
      class="domain-policy-rules-table__table"
      :columns="columns"
      :pagination="false"
      :data-source="rulesByPage"
      row-key="uuid"
      :loading="status === STATUS.LOADING"
    >
      <template #bodyCell="{ column, record, index }">
        <template v-if="column.key === 'position'">
          <div class="positon">
            <a-button :disabled="!editing || !editable" class="ls-button ls-position-button" @click="moveUp(index)">
              <UpOutlined />
            </a-button>
            <a-button :disabled="!editing || !editable" class="ls-button ls-position-button" @click="moveDown(index)">
              <DownOutlined />
            </a-button>
          </div>
        </template>
        <template v-if="column.key === 'domain'">
          <span class="elipsis-name">{{
            record?.type === 'ALLOW_ALL' ? $t('DOMAIN_POLICY.ALL_DOMAIN') : record?.domain?.label
          }}</span>
        </template>
        <template v-if="column.key === 'type'">
          <CheckOutlined v-if="record?.type === 'ALLOW' || record?.type === 'ALLOW_ALL'" class="type-allow" />
          <CloseOutlined v-else class="type-deny" />
        </template>
        <template v-if="column.key === 'actions'">
          <a-button :disabled="!editing || !editable" class="ls-button ls-position-button" @click="onRemoveRule(index)">
            <DeleteFilled class="type-deny" />
          </a-button>
        </template>
      </template>
    </a-table>
  </div>
</template>
<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { computed, onMounted, reactive, ref } from 'vue';
import Domain from '@/core/types/Domain';
import { STATUS } from '@/core/types/Status';
import { message } from 'ant-design-vue';
import { DomainPolicyRule } from '../../types/DomainPolicy';
import useDomainPolicies from '../../hooks/useDomainPolicies';
import {
  CheckOutlined,
  PlusOutlined,
  CloseOutlined,
  UpOutlined,
  DownOutlined,
  DeleteFilled,
  CheckCircleOutlined,
} from '@ant-design/icons-vue';
import { getDomainsV4 } from '@/modules/domain/services/domain-api';
import { APIError } from '@/core/types/APIError';

const { t } = useI18n();
const { status, activeDomainPolicyForm } = useDomainPolicies();

// props & emits
const props = defineProps<{
  editable?: boolean;
  editing?: boolean;
}>();

//data
const selectRule = reactive<{ rule?: 'ALLOW' | 'ALLOW_ALL' | 'DENY' | 'DENY_ALL'; domain?: Domain; domainId?: string }>(
  {}
);
const domains = ref<{ label: string | undefined; value: string; subject: Domain }[]>([]);

// computed
const rules = computed(() => {
  return [
    {
      label: t('DOMAIN_POLICY.CREATE_MODAL.ALLOW'),
      value: 'ALLOW',
    },
    {
      label: t('DOMAIN_POLICY.CREATE_MODAL.ALLOW_ALL'),
      value: 'ALLOW_ALL',
    },
    {
      label: t('DOMAIN_POLICY.CREATE_MODAL.DENY'),
      value: 'DENY',
    },
    {
      label: t('DOMAIN_POLICY.CREATE_MODAL.DENY_ALL'),
      value: 'DENY_ALL',
    },
  ];
});
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
  return activeDomainPolicyForm.value?.accessPolicy?.rules;
});

const isAllRule = computed(() => {
  return selectRule.rule === 'ALLOW_ALL' || selectRule.rule === 'DENY_ALL';
});

// methods
function onSelectRule() {
  if (isAllRule.value) {
    selectRule.domain = {
      label: t('DOMAIN_POLICY.ALL_DOMAIN'),
      value: 'ALL',
    };

    selectRule.domainId = 'ALL';
  }
}
function onAddRule() {
  if (selectRule.rule === 'ALLOW_ALL' || selectRule.rule === 'DENY_ALL') {
    activeDomainPolicyForm.value?.accessPolicy?.rules.push({
      domain: { label: t('DOMAIN_POLICY.ALL_DOMAIN') } as Domain,
      type: selectRule.rule as 'ALLOW' | 'ALLOW_ALL' | 'DENY' | 'DENY_ALL',
    });
  } else if (selectRule.domainId && selectRule.rule) {
    activeDomainPolicyForm.value?.accessPolicy?.rules.push({
      domain: { ...selectRule.domain } as Domain,
      type: selectRule.rule as 'ALLOW' | 'ALLOW_ALL' | 'DENY' | 'DENY_ALL',
    });
  }
}
function onSelectDomain(
  value: string,
  model: { key: { label: string | undefined; value: string; subject: Domain }; label: string; subject: Domain }
) {
  selectRule.domain = model.key.subject;
}

function onRemoveRule(index: number) {
  activeDomainPolicyForm.value?.accessPolicy?.rules.splice(index, 1);
}

async function fetchDomains() {
  try {
    const response = await getDomainsV4({ params: { tree: false } });
    domains.value = (response as Domain[]).map((item) => {
      return { label: item?.label, value: item?.identifier, subject: item };
    });
  } catch (error) {
    if (error instanceof APIError) {
      message.error(error.getMessage());
    }
  }
}

function moveRule(from: number, to: number) {
  activeDomainPolicyForm.value?.accessPolicy?.rules.splice(
    to,
    0,
    activeDomainPolicyForm.value?.accessPolicy?.rules.splice(from, 1)[0]
  );
}

function moveUp(index: number) {
  if (index < 1) {
    return;
  }
  moveRule(index, index - 1);
}

function moveDown(index: number) {
  if (index === activeDomainPolicyForm.value?.accessPolicy?.rules?.length || 0 - 1) {
    return;
  }
  moveRule(index, index + 1);
}

onMounted(() => {
  fetchDomains();
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

  &__rule-form {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-end;
    gap: 8px;
  }

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

  &__form {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    gap: 16px;
  }

  .ls-form-title {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    margin-bottom: 0;
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

  .ant-form-item-label {
    text-align: left;
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    letter-spacing: -0.01em;
    color: #6d7885;
  }
  .ant-form-item-control-input {
    min-height: 42px;
  }
  .ant-col {
    min-height: unset;
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
  .ls-add {
    height: 44px !important;
    color: #007aff;
    font-size: 14px;
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
