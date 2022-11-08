<script lang="ts" setup>
import TheSubheader from '@/core/components/the-subheader.vue';
import ArrowLeftIcon from '@/core/components/icons/arrow-left-icon.vue';
import ArrowRightIcon from '@/core/components/icons/arrow-right-icon.vue';
import LsButton from '@/core/components/ls/ls-button.vue';
import { useRoute, useRouter } from 'vue-router';
import { computed } from 'vue';

const route = useRoute();
const router = useRouter();

const isInDomainDetail = computed(() => {
  return !!route.params?.domainUuid;
});

const isDomainSelected = computed(() => {
  return true;
});
</script>
<template>
  <the-subheader :title="$t('NAVIGATOR.CONFIGURATION')" :detail="$t('CONFIGURATION.INTRODUCTION')"> </the-subheader>
  <div class="configuration-page">
    <div class="configuration-page__wrapper">
      <div class="configuration-page__header">
        <div class="configuration-page__header-title">
          <strong class="title">Manage domain</strong>
          <span class="breakcrumb">Configuration / LinShare Root Domain</span>
        </div>
        <div v-if="isInDomainDetail" class="configuration-page__header-action">
          <div class="preview-action">
            <span class="label">Previous domain</span>
            <button class="action">
              <arrow-left-icon></arrow-left-icon>
            </button>
          </div>
          <div class="next-action">
            <button class="action">
              <arrow-right-icon></arrow-right-icon>
            </button>
            <span class="label">Next domain</span>
          </div>
        </div>
        <div v-if="!isInDomainDetail && isDomainSelected" class="configuration-page__header-action">
          <ls-button color="info">
            <arrow-left-icon class="icon"></arrow-left-icon>
            View details
          </ls-button>
          <ls-button color="info">
            <arrow-left-icon class="icon"></arrow-left-icon>
            Create Child domain
          </ls-button>
          <ls-button color="error">
            <arrow-left-icon class="icon"></arrow-left-icon>
            Delete
          </ls-button>
        </div>
      </div>
      <div class="configuration-page__body">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>
<style lang="less">
.configuration-page {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
  width: 100%;
  background-color: #f6f6f6;
  padding: 20px;

  &__wrapper {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    padding: 32px;
    gap: 16px;
    background: #ffffff;
    border-radius: 10px;
    min-height: 68vh;
  }

  &__header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 16px;
    border-bottom: 1px solid #e4e5f0;
  }

  &__header-title {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;

    .title {
      font-style: normal;
      font-weight: 700;
      font-size: 24px;
      line-height: 28px;
      color: #434657;
    }

    .breakcrumb {
      font-style: normal;
      font-weight: 500;
      font-size: 15px;
      line-height: 20px;
    }
  }

  &__header-action {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    gap: 20px;

    .preview-action {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;
      gap: 8px;
    }

    .next-action {
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
      align-items: center;
      gap: 8px;
    }

    .action {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      padding: 10px;
      width: 44px;
      height: 44px;
      background: #ffffff;
      border: 1px solid #e4e5f0;
      border-radius: 100px;
    }

    .icon {
      margin-right: 12px;
    }
  }
}
</style>
