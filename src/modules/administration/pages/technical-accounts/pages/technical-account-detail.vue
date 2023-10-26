<template>
  <div>
    <a-tabs v-model:activeKey="activeKey">
      <a-tab-pane key="1" :tab="$t('TECHNICAL_ACCOUNTS.DETAIL_PAGE.USER_INFORMATIONS_TITLE')"
        ><UserInformations
      /></a-tab-pane>
      <a-tab-pane key="2" :tab="$t('TECHNICAL_ACCOUNTS.DETAIL_PAGE.CHANGE_PASSWORD')">Password tab</a-tab-pane>
    </a-tabs>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import UserInformations from '../components/detail-page/user-informations.vue';

const activeKey = ref('1');
</script>
<style lang="less" scoped></style>
