<template>
  <a-modal :visible="error" :closable="false">
    <template #title>
      <ExclamationCircleOutlined class="hydrate-icon" /> {{ $t('GENERAL.FAIL_TO_LOAD_DATA') }}
    </template>
    <template #footer>
      <div class="footer">
        <a-button type="primary" @click="hydrate">
          {{ $t('GENERAL.REFRESH') }}
        </a-button>
      </div>
    </template>
    <p class="hydrate-error">
      {{ $t('GENERAL.REQUEST_RELOAD_DATA') }}
    </p>
  </a-modal>
</template>

<script lang="ts" setup>
import { useAppStore } from '@/core/store';
import { storeToRefs } from 'pinia';
import { hydrate } from '@/core/store/hydrate';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';

const appStore = useAppStore();
const { error } = storeToRefs(appStore);
</script>

<style lang="less" scoped>
@import '@/core/styles/main.less';

.hydrate-error {
  margin-bottom: 0;
}
.hydrate-icon {
  color: @primary-color;
  margin-right: 4px;
}
</style>
