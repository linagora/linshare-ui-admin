<template>
  <div class="inconsistent-users-page">
    <div class="inconsistent-users-page-tabs">
      <inconsistent-users-tabs></inconsistent-users-tabs>
    </div>
    <div class="inconsistent-users-page__content">
      <router-view></router-view>
    </div>
  </div>
</template>
<script lang="ts" setup>
import InconsistentUsersTabs from '../components/inconsistent-users-tabs.vue';
</script>
<style lang="less" scoped>
.title {
  margin-left: 10px;
}

.inconsistent-users-page {
  display: flex;
  flex-direction: column;
}
</style>
