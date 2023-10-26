<template>
  <div class="technical-account-detail">
    <div class="component">
      <TechnicalAccountInformations />
    </div>
    <div class="component">
      <TechnicalAccountPermissions />
    </div>
    <div class="component">
      <SystemInformationCard />
    </div>
  </div>
</template>
<script lang="ts" setup>
import TechnicalAccountInformations from '../detail-page/technical-account-informations.vue';
import TechnicalAccountPermissions from '../detail-page/technical-account-permission-table.vue';
import SystemInformationCard from '../detail-page/system-information-card.vue';
</script>
<style lang="less">
.technical-account-detail {
  display: flex;
  justify-content: space-between;
  align-items: stretch;
}

.component {
  flex: 1;
  margin: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
</style>
