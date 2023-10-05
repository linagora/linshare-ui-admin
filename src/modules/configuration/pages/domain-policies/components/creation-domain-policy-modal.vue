<template>
  <a-form ref="formRef">
    <a-card flat :bordered="false" class="create-domain-policy-card">
      <div class="create-domain-policy-card__title">{{ $t('DOMAIN_POLICY.CREATE_MODAL.CREATE_MODAL_TITLE') }}</div>
      <a-tabs centered>
        <a-tab-pane key="1" :tab="$t('DOMAIN_POLICY.CREATE_MODAL.DETAIL_TAB')">
          <div class="create-domain-policy-card__form">
            <a-form-item
              class="ls-form-title"
              v-bind="validateInfos.label"
              :label="$t('DOMAIN_POLICY.CREATE_MODAL.NAME')"
            >
              <a-input
                id="name"
                v-model:value="form.label"
                class="ls-input"
                :placeholder="$t('DOMAIN_POLICY.CREATE_MODAL.PLACEHOLDER_NAME')"
              ></a-input>
            </a-form-item>
            <a-form-item class="ls-form-title" :label="$t('DOMAIN_POLICY.CREATE_MODAL.DESCRIPTION')">
              <a-textarea
                id="name"
                v-model:value="form.description"
                class="ls-input"
                :auto-size="{ minRows: 4, maxRows: 8 }"
              ></a-textarea>
            </a-form-item>
          </div>
        </a-tab-pane>
        <a-tab-pane key="2" :tab="$t('DOMAIN_POLICY.CREATE_MODAL.RULES_TAB')">
          <div class="create-domain-policy-card__rule-form">
            <a-form-item style="width: 100px" class="ls-form-title" :label="$t('DOMAIN_POLICY.CREATE_MODAL.TYPE')">
              <a-select v-model:value="selectRule.rule" class="ls-input" :bordered="false">
                <a-select-option v-for="s in rules" :key="s.value" :value="s.value">
                  {{ s.label }}
                </a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item
              style="flex-grow: 1"
              class="ls-form-title"
              :label="$t('DOMAIN_POLICY.CREATE_MODAL.SELECT_DOMAIN')"
            >
              <a-select v-model:value="selectRule.domainId" class="ls-input" :bordered="false" @select="onSelectDomain">
                <a-select-option v-for="s in domains" :key="s" :value="s.value">
                  {{ s.label }}
                </a-select-option>
              </a-select>
            </a-form-item>
            <a-button class="ls-button ls-add" @click="onAddRule">
              <PlusOutlined />
              {{ $t('DOMAIN_POLICY.CREATE_MODAL.ADD') }}
            </a-button>
          </div>
          <div class="create-domain-policy-card__rule-list">
            <span>{{ $t('DOMAIN_POLICY.CREATE_MODAL.POLICY_LIST') }}</span>
            <div
              v-for="(item, index) in form.accessPolicy.rules"
              :key="index + '__rule-item'"
              class="create-domain-policy-card__rule-item"
            >
              <a-button class="ls-button ls-add" @click="moveUp(index)">
                <UpOutlined />
              </a-button>
              <a-button class="ls-button ls-add" @click="moveDown(index)">
                <DownOutlined />
              </a-button>
              <div class="create-domain-policy-card__rule-item-content">
                <span>{{ $t(`DOMAIN_POLICY.CREATE_MODAL.${item.type}`) }}</span>
                <span>{{ item.domain.label }}</span>
              </div>
              <a-button class="ls-button ls-add" style="color: red" @click="onRemoveRule(index)">
                <DeleteFilled />
              </a-button>
            </div>
          </div>
        </a-tab-pane>
      </a-tabs>
      <div class="create-domain-policy-card__actions">
        <a-button class="ls-button ls-cancel" type="primary" @click="onCloseModal">{{ $t('GENERAL.CANCEL') }}</a-button>
        <a-button class="ls-button ls-save" type="primary" @click="onCreateDomainPolicy">
          <a-spin v-if="loading" />
          <span v-else>{{ $t('GENERAL.CREATE') }}</span>
        </a-button>
      </div>
    </a-card>
  </a-form>
</template>
<script lang="ts" setup>
import { onMounted, reactive, ref, computed } from 'vue';
import { getDomainsV4 } from '@/modules/domain/services/domain-api';
import { message, Form, FormInstance } from 'ant-design-vue';
import { APIError } from '@/core/types/APIError';
import { useI18n } from 'vue-i18n';
import { PlusOutlined, UpOutlined, DownOutlined, DeleteFilled } from '@ant-design/icons-vue';
import useDomainPolicies from '@/modules/configuration/pages/domain-policies/hooks/useDomainPolicies';
import Domain from '@/core/types/Domain';
// props
const emits = defineEmits(['refresh', 'close']);
// composable
const { t } = useI18n();
const useForm = Form.useForm;
const { loading, handleCreateDomainPolicy } = useDomainPolicies();
//data
const form = reactive<{
  accessPolicy: {
    rules: {
      type: 'ALLOW' | 'ALLOW_ALL' | 'DENY' | 'DENY_ALL';
      domain: Domain;
    }[];
  };
  label: string;
  description: string;
}>(getInitialFormData());
const selectRule = reactive<{ rule?: 'ALLOW' | 'ALLOW_ALL' | 'DENY' | 'DENY_ALL'; domain?: Domain; domainId?: string }>(
  {}
);
const formRef = ref<FormInstance>();
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
const formRules = computed(() => ({
  label: [
    {
      required: true,
      message: t('GENERAL.FIELD_REQUIRED'),
    },
  ],
}));
const { validate, validateInfos, resetFields } = useForm(form, formRules);

// methods

function onSelectDomain(
  value: string,
  model: { key: { label: string | undefined; value: string; subject: Domain }; label: string; subject: Domain }
) {
  selectRule.domain = model.key.subject;
}

function onAddRule() {
  if (selectRule.domainId && selectRule.rule) {
    form.accessPolicy.rules.push({
      domain: { ...selectRule.domain } as Domain,
      type: selectRule.rule as 'ALLOW' | 'ALLOW_ALL' | 'DENY' | 'DENY_ALL',
    });
  }
}

function onRemoveRule(index: number) {
  form.accessPolicy.rules.splice(index, 1);
}

function getInitialFormData() {
  return {
    accessPolicy: {
      rules: [],
    },
    label: '',
    description: '',
  };
}

function resetFormData() {
  Object.assign(form, getInitialFormData());
  resetFields();
}

async function onCloseModal() {
  resetFormData();
  emits('close');
}

async function onCreateDomainPolicy() {
  try {
    await validate();
  } catch (error) {
    return;
  }
  await handleCreateDomainPolicy(form);
  emits('refresh');
  onCloseModal();
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
  form.accessPolicy.rules.splice(to, 0, form.accessPolicy.rules.splice(from, 1)[0]);
}

function moveUp(index: number) {
  if (index < 1) {
    return;
  }
  moveRule(index, index - 1);
}

function moveDown(index: number) {
  if (index === form.accessPolicy.rules?.length - 1) {
    return;
  }
  moveRule(index, index + 1);
}

onMounted(async () => {
  await fetchDomains();
});
</script>

<style lang="less">
.create-domain-policy-card {
  border-radius: 25px;
  .ant-card-body {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: stretch;
    border: none;
  }

  &__title {
    font-weight: 600;
    font-size: 20px;
    line-height: 24px;
    width: 100%;
    color: #1b1d29;
    text-align: center;
    margin-bottom: 20px;
  }

  &__actions {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 12px;
    margin-top: 28px;

    .ls-button {
      flex-grow: 1;
    }

    .ls-cancel,
    .ls-cancel:hover {
      background-color: #f3f3f7;
      color: #007aff;
      border-color: #f3f3f7;
    }
  }

  &__form {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    gap: 16px;
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

  .ls-form-title {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    margin-bottom: 0;
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

  .ls-form-title-switch .ant-form-item-control-input-content {
    display: flex;
    flex-direction: row !important;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: flex-start;
    gap: 12px;
    width: fit-content;
    color: #434657;
    font-size: 14px;
    line-height: 20px;
    letter-spacing: -0.02em;
    font-weight: normal;
  }

  .ls-switch {
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

  .ant-select-selector {
    height: 100% !important;
    border-radius: 10px;
  }

  .ant-select-single .ant-select-selector .ant-select-selection-item,
  .ant-select-single .ant-select-selector .ant-select-selection-placeholder {
    line-height: 40px;
  }
  &__rule-form {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-end;
    gap: 8px;
  }
  .ls-add {
    height: 44px !important;
    color: #007aff;
    font-size: 14px;
  }
  &__rule-list {
    min-height: 120px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    gap: 8px;
    margin-top: 24px;
  }
  &__rule-item {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-end;
    gap: 8px;
  }
  &__rule-item-content {
    flex-grow: 1;
    display: flex;
    flex-direction: row;
    padding: 4px 8px;
    align-items: center;
    align-content: center;
    gap: 8px;
    align-self: stretch;
    flex-wrap: wrap;
    border-radius: 10px;
    border: 1px solid var(--neutral-colors-color-divider, #e4e5f0);
    background: var(--neutral-colors-color-white, #fff);
  }
  &__rule-item-content span {
    display: flex;
    padding: 6px 12px;
    align-items: flex-start;
    gap: 8px;
    border-radius: 6px;
    background: var(--neutral-colors-color-background, #f3f3f7);
  }
}
</style>
