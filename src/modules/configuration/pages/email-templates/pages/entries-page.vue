<template>
  <div class="email-templates-page">
    <div class="email-templates-page__vertical-tabs">
      <email-templates-vertical-tabs></email-templates-vertical-tabs>
    </div>
    <div class="email-templates-page__content">
      <RouterView />
    </div>
  </div>
</template>
<script lang="ts" setup>
import emailTemplatesVerticalTabs from '../components/email-templates-vertical-tabs.vue';
</script>
<style lang="less">
.email-templates-page {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: stretch;
  &__content {
    flex-grow: 1;
    padding-left: 40px;
  }
}
</style>
