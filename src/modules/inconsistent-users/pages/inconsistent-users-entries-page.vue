<template>
  <div class="inconsistent-users-page">
    <div class="inconsistent-users-page-tabs">
      <inconsistent-users-tabs></inconsistent-users-tabs>
    </div>
    <div class="inconsistent-users-page__content">
      <RouterView />
    </div>
  </div>
</template>
<script lang="ts" setup>
import inconsistentUsersTabs from '../components/inconsistent-users-tabs.vue';
</script>
<style lang="less"></style>
