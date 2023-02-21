<template>
  <div class="ls-quota-input" compact>
    <div v-if="label" class="ls-quota-input__label">
      {{ label }}
    </div>
    <div class="ls-quota-input__field">
      <a-input
        :value="modelValue"
        :disabled="disabled"
        class="ls-quota-input__qty"
        @input="onChangeQuota($event.target.value)"
      />
      <a-select
        :value="modelUnit"
        :disabled="disabled"
        class="ls-quota-input__unit"
        dropdown-class-name="ls-quota-input__unit--dropdown"
        @change="onChangeUnit($event)"
      >
        <a-select-option v-for="(unit, index) in quotaUnits" :key="index + 'ls-quota-input'" :value="unit.value">
          {{ unit.name }}</a-select-option
        >
      </a-select>
      <a-tooltip v-if="overrideMode" :title="overrideTooltip" trigger="hover">
        <ls-button
          class="ant-btn ls-button ls-button-override ls-button--info"
          color="info"
          :disabled="lockDisabled"
          @click="onChangeOverrideMode"
        >
          <lock-icon v-show="!modelOverride" class="icon"></lock-icon>
          <unlock-icon v-show="modelOverride" class="icon"></unlock-icon>
        </ls-button>
      </a-tooltip>
    </div>
    <div v-if="hint" class="ls-quota-input__hint">
      {{ hint }}
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { Unit } from '@/core/types/Unit';
import LsButton from '@/core/components/ls/ls-button.vue';
import LockIcon from '@/core/components/icons/lock-icon.vue';
import UnlockIcon from '@/core/components/icons/unlock-icon.vue';

const quotaUnits: Unit[] = [
  { name: 'Byte', value: 'B', factor: 0 },
  { name: 'KB', value: 'KB', factor: 3 },
  { name: 'MB', value: 'MB', factor: 6 },
  { name: 'GB', value: 'GB', factor: 9 },
  { name: 'TB', value: 'TB', factor: 12 },
  { name: 'PB', value: 'PB', factor: 15 },
  { name: 'EB', value: 'EB', factor: 18 },
  { name: 'ZB', value: 'ZB', factor: 21 },
  { name: 'YB', value: 'YB', factor: 24 },
];
// composable
const { t } = useI18n();

// data
const emits = defineEmits(['update:modelValue', 'update:modelUnit', 'update:modelOverride', 'update:modelLock']);
const props = defineProps<{
  modelValue?: number | string;
  modelUnit?: Unit | string | undefined;
  modelOverride?: boolean | undefined;
  modelLock?: boolean | undefined;
  defaultValue?: string | number;
  defaultQuota?: string | number;
  defaultUnit?: Unit | string | undefined;
  overrideMode?: boolean;
  label?: string;
  hint?: string;
  disabled?: boolean;
  lockDisabled?: boolean;
}>();

// computed
const overrideTooltip = computed(() => {
  return props.modelOverride
    ? t('QUOTA.HINT_LABELS.HINT_RESET_TOOLTIP', { value: props.defaultQuota })
    : t('QUOTA.HINT_LABELS.HINT_UNLINK_TOOLTIP');
});

// methods
function onChangeUnit(item: Event) {
  emits('update:modelUnit', item);
}

function onChangeQuota(item: number) {
  emits('update:modelValue', item);
}

function onChangeOverrideMode() {
  emits('update:modelValue', props.defaultValue);
  emits('update:modelUnit', props.defaultUnit);
  emits('update:modelOverride', !props.modelOverride);
}
</script>
<style lang="less">
.ls-quota-input {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
  gap: 8px;

  &__label {
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    letter-spacing: -0.01em;
    color: #6d7885;
  }

  &__hint {
    font-weight: 400;
    font-size: 13px;
    line-height: 16px;
    color: #6d7885;
  }

  &__field {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: stretch;
    gap: 12px;
  }

  &__qty {
    height: 44px;
    background: #ffffff;
    border: 1px solid #e4e5f0;
    border-radius: 10px !important;
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 20px;
    letter-spacing: -0.02em;
    color: #434657;
  }

  &__unit {
    .ant-select-selector {
      height: 44px !important;
      background: #ffffff;
      border: 1px solid #e4e5f0 !important;
      border-radius: 10px !important;
      width: 150px;
      min-width: 100px;
      max-width: 150px;
    }

    .ant-select-selection-search {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
    }

    .ant-select-selection-item {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;
      font-style: normal;
      font-weight: 400;
      font-size: 16px;
      line-height: 20px;
      letter-spacing: -0.02em;
      color: #434657;
    }
  }

  &__unit--dropdown {
    &.ant-select-dropdown {
      padding: 8px 8px 8px 8px !important;
      background: #ffffff;
      box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.08), 0px 8px 24px rgba(0, 0, 0, 0.08);
      border-radius: 8px;
    }

    .ant-select-item {
      font-style: normal;
      font-weight: 400;
      font-size: 16px;
      line-height: 20px;
      display: flex;
      align-items: center;
      letter-spacing: -0.02em;
      padding: 14xp 24px;
    }

    .ant-select-item.ant-select-item-option-active {
      background: #f3f3f7;
      border-radius: 6px;
      color: #007aff;
    }
  }

  &__unit.ant-select-focused {
    outline: none;
    box-shadow: none;

    .ant-select-selector {
      border: 1px solid #007aff !important;
      box-shadow: none !important;
    }
  }

  .ls-button-override,
  .ls-button-lock {
    min-height: 44px;
    min-width: 44px;
    height: 44px;
    width: 44px;
    padding: 0;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }
}
</style>
