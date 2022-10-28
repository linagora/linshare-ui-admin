<template>
  <Collapse
    ><CollapsePanel :header="props.headerText">
      <Alert
        v-if="checked.checked === true"
        :message="$t('QUOTA.MAINTENANCE_MODE_ACTIVATED')"
        type="warning"
        banner
        :show-icon="false"
      ></Alert>
      <Alert v-else :message="props.alertText" type="info" banner :show-icon="false"></Alert>
      <h3 class="card-title">{{ $t('QUOTA.CURRENT DOMAIN QUOTA') }}</h3>
      <div class="quota-informations">
        <div class="quota-input">
          <div class="maintenance-mode">
            <a-switch v-model:checked="checked.checked" class="maintenance-switch" />
            <span>{{ $t('QUOTA.MAINTENANCE_MODE') }}</span>
          </div>
          <QuotaInput
            :label="props.label"
            :note="props.note"
            :model-unit="data.modelUnit"
            :model-value="data.modelValue"
            @update:model-value="quotaValue"
            @update:model-unit="quotaUnit"
          ></QuotaInput>
          <div class="maximum-quota">
            <span>{{ $t('QUOTA.DOMAIN_MAXIMUM_QUOTA') }}</span>
            <span class="maximum-quota-value">{{ props.maximimQuota }}</span>
          </div>
        </div>
        <div class="quota-chart">
          <QuotaVisualizeCard
            :used-space="props.usedSpace"
            :remaining-quota="props.remainingQuota"
            :unallocated-space="props.unallocatedSpace"
            :sub-quota="props.subQuota"
          ></QuotaVisualizeCard>
        </div>
      </div>
    </CollapsePanel>
  </Collapse>
</template>

<script lang="ts" setup>
import { reactive } from 'vue';
import CollapsePanel from '../../core/components/ls/ls-collapse-panel.vue';
import Collapse from '../../core/components/ls/ls-collapse.vue';
import Alert from '../../core/components/ls/ls-alert.vue';
import QuotaVisualizeCard from './components/quota-visualize.vue';
import QuotaInput from '@/core/components/ls/ls-quota-input.vue';
import { useI18n } from 'vue-i18n';

interface Props {
  headerText?: string;
  alertText?: string;
  usedSpace?: number;
  remainingQuota?: number;
  unallocatedSpace?: number;
  subQuota?: number;
  maximimQuota?: string;
  note?: string;
  label?: string;
  modelValue?: number;
  modelUnit?: object;
}

const { t } = useI18n();
const emits = defineEmits(['update:modelValue', 'update:modelUnit']);
const props = defineProps<Props>();
const checked = reactive({
  checked: false,
});

const data = reactive({
  modelValue: props.modelValue,
  modelUnit: { name: '', value: '', factor: 0 },
});

function quotaValue(value: any) {
  data.modelValue = Number(value);

  emits('update:modelValue', Number(value));
}
function quotaUnit(value: any) {
  data.modelUnit.value = value;
  emits('update:modelUnit', value);
}
</script>

<style lang="less" scoped>
.quota-informations {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  margin-top: 20px;
}
.card-title {
  margin-top: 15px;
}
.maintenance-mode {
  display: flex;
  flex-direction: row;
  margin-bottom: 10px;
}

.maintenance-switch {
  margin-right: 5px;
}
.maximum-quota {
  margin-top: 25px;
  color: #6d7885;
}
.maximum-quota-value {
  color: black;
  font-weight: bolder;
}
</style>
