<template>
  <div class="mime-detail-card">
    <div class="mime-detail-card__name">
      <span>{{ $t('MIME_POLICIES.NAME') }} <span class="aterisk">*</span></span>
      <a-input
        v-model:value="form.mimePolicyName"
        :disabled="!editable || !editing"
        class="mime-detail-card__name-input"
      />
    </div>
    <div class="mime-detail-card__information">
      <mime-type-options :item="item" :editable="editable"></mime-type-options>
      <mime-system-information :item="item"></mime-system-information>
    </div>
    <div v-if="editing && editable" class="mime-detail-card__action">
      <a-button :disabled="loading" type="primary" class="ls-button" @click="onSave">
        <a-spin v-if="loading"></a-spin>
        <span v-else>{{ $t('GENERAL.SAVE') }}</span>
      </a-button>
      <a-button class="ls-button ls-cancel" @click="onCancel">
        {{ $t('GENERAL.CANCEL') }}
      </a-button>
      <a-button class="ls-button ls-reset" @click="onReset">
        {{ $t('GENERAL.RESET') }}
      </a-button>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { reactive, watch } from 'vue';
import { MimePolicy } from '@/modules/configuration/pages/type-mime-policies/types/MimeType';
import MimeSystemInformation from '@/modules/configuration/pages/type-mime-policies/components/detail-page/mime-system-information.vue';
import MimeTypeOptions from '@/modules/configuration/pages/type-mime-policies/components/detail-page/mime-type-options.vue';
import { forIn } from 'lodash';

const props = defineProps<{
  item: MimePolicy | undefined;
  editable?: boolean;
  editing?: boolean;
  loading?: boolean;
}>();
const emits = defineEmits(['save', 'reset', 'cancel']);

// composable

// computed
const form = reactive({
  mimePolicyName: props.item?.name,
  oldMimePolicyName: props.item?.name,
});

//methods
function onSave() {
  emits('save', form.mimePolicyName);
}

function onCancel() {
  onReset();
  emits('cancel');
}

function onReset() {
  form.mimePolicyName = form.oldMimePolicyName;
}

watch(
  () => props.item?.name,
  (newVal) => {
    form.mimePolicyName = newVal;
    form.oldMimePolicyName = newVal;
  }
);
</script>
<style lang="less">
.mime-detail-card {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
  &__name {
    .aterisk {
      color: #ea3c3c;
    }
  }
  &__name-input {
    border: 1px solid #e4e5f0;
    border-radius: 10px;
    height: 44px;
    margin-bottom: 20px;
  }
  &__space {
    flex-grow: 1;
  }

  &__action {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: 12px;
    margin-top: 20px;
    .ls-button {
      padding: 0px 20px;
      width: 88px;
      min-width: 88px;
      height: 44px;
      border-radius: 8px;
    }
    .ls-filled {
      background-color: #007aff;
      color: #f3f3f7;
      .ant-spin {
        color: #f3f3f7;
      }
      .ant-spin-dot-item {
        background-color: #f3f3f7;
      }
    }
    .ls-reset {
      color: #ea3c3c;
    }
    .ls-cancel {
      color: #007aff;
    }
  }
}
</style>
