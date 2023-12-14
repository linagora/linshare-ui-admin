<template>
  <div class="type-options">
    <h4 class="section-title">{{ $t('MIME_POLICIES.MIME_TYPE_OPTIONS.DESCRIPTION') }}</h4>
    <div class="option-block">
      <div class="value">
        <a-radio-group v-model:value="minePolicy.unknownTypeAllowed" @change="onUpdateUnknownTypeAllowed($event)">
          <a-radio :value="false" :disabled="!isAllowEditEnable">
            <div class="title">{{ $t('MIME_POLICIES.MIME_TYPE_OPTIONS.BLACKLIST') }}</div>
            <div class="description">{{ $t('MIME_POLICIES.MIME_TYPE_OPTIONS.BLACKLIST_DESCRIPTION') }}</div>
          </a-radio>
          <a-radio :value="true" :disabled="!isAllowEditEnable">
            <div class="title">{{ $t('MIME_POLICIES.MIME_TYPE_OPTIONS.WHITELIST') }}</div>
            <div class="description">{{ $t('MIME_POLICIES.MIME_TYPE_OPTIONS.WHITELIST_DESCRIPTION') }}</div>
          </a-radio>
        </a-radio-group>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed, reactive } from 'vue';
import { useRoute } from 'vue-router';
import { cloneDeep } from 'lodash-es';
import { MimePolicy } from '@/modules/configuration/pages/type-mime-policies/types/MimeType';

interface Props {
  item: MimePolicy;
  editable?: boolean;
  editing?: boolean;
}

const route = useRoute();

const props = defineProps<Props>();
const emits = defineEmits(['save']);

const isAllowEditEnable = computed(() => {
  return props.editable;
});

const minePolicy = reactive<MimePolicy>(cloneDeep(props.item));

async function onUpdateUnknownTypeAllowed() {
  const payload: MimePolicy = {
    ...props.item,
    unknownTypeAllowed: minePolicy.unknownTypeAllowed,
  };

  emits('save', payload);
}
</script>
<style lang="less">
.type-options {
  border-radius: 12px;
  background-color: #fafafa;
  padding: 16px 16px 5px;
  margin-bottom: 20px;
  color: #6d7885;

  .ant-radio-wrapper {
    margin-bottom: 20px;

    .title {
      font-weight: 500;
      margin-bottom: 5px;
    }

    .description {
      color: #6d7885;
    }
  }
}

.option-block {
  margin-left: 10px;
  display: flex;
  flex-direction: row;
  margin-bottom: 20px;
}

.section-title {
  margin-bottom: 15px;
  color: #434657;
}
</style>
