<template>
  <div class="configuration-index-page">
    <div class="entry-card">
      <div class="image">
        <empty-icon></empty-icon>
      </div>
      <div class="content">
        <strong>Select domain to start</strong>
        <span>You need to choose one domain by the button below before start make any changes on its setting</span>
      </div>
      <div class="action">
        <ls-button color="info" type="primary" @click="openSelectDomainModal = true">Select domain</ls-button>
      </div>
    </div>
    <select-domain-modal
      v-model:visible="openSelectDomainModal"
      @close="openSelectDomainModal = false"
    ></select-domain-modal>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import EmptyIcon from '@/core/components/icons/empty-icon.vue';
import LsButton from '@/core/components/ls/ls-button.vue';
import SelectDomainModal from '@/modules/configuration/components/select-domain-modal.vue';

const openSelectDomainModal = ref(false);
</script>
<style lang="less">
.configuration-index-page {
  .entry-card {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 40px;
  }

  .entry-card .content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 8px;
  }

  .entry-card .content strong {
    font-style: normal;
    font-weight: 700;
    font-size: 24px;
    line-height: 28px;
    text-align: center;
    color: #434657;
  }

  .entry-card .content span {
    width: 347px;
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    text-align: center;
    letter-spacing: -0.01em;
    color: #6d7885;
  }
}
</style>
