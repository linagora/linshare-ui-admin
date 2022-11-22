<script lang="ts" setup>
import TheSubheader from '@/core/components/the-subheader.vue';
import ArrowLeftIcon from '@/core/components/icons/arrow-left-icon.vue';
import ConfigDomainActions from '@/core/components/layouts/config-domain-actions.vue';
import ConfigDomainRedirectAction from '@/core/components/layouts/config-domain-redirect-action.vue';
import LsButton from '@/core/components/ls/ls-button.vue';
import { useRoute, useRouter } from 'vue-router';
import { computed } from 'vue';
import { useDomainStore } from '@/modules/domain/store';
const domainStore = useDomainStore();
const currentDomainName = computed(() => domainStore.currentDomain.name);

const route = useRoute();
const router = useRouter();

const isInDomainDetail = computed(() => {
  return !!route.params?.domainUuid;
});

const isDomainSelected = computed(() => {
  return true;
});

function onBackToConfigurationPage() {
  router.push({ name: 'ConfigurationEntries' });
}
</script>
<template>
  <the-subheader :title="$t('NAVIGATOR.CONFIGURATION')" :detail="$t('CONFIGURATION.INTRODUCTION')"> </the-subheader>
  <div class="configuration-page">
    <div class="configuration-page__wrapper">
      <div class="configuration-page__header">
        <div class="configuration-page__header-title">
          <ls-button
            v-if="isInDomainDetail"
            type="text"
            class="configuration-page__back"
            @click="onBackToConfigurationPage"
          >
            <arrow-left-icon width="18" height="18" class="icon"></arrow-left-icon>
          </ls-button>
          <div class="configuration-page__header-title-content">
            <strong class="title">Manage domain</strong>
            <span class="breakcrumb"
              >Configuration / <span class="current">{{ currentDomainName }}</span></span
            >
          </div>
        </div>
        <config-domain-redirect-action v-if="isInDomainDetail"></config-domain-redirect-action>
        <config-domain-actions v-if="!isInDomainDetail && isDomainSelected"></config-domain-actions>
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
  padding: 0;

  &__back {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;
    padding: 4px;
    padding-right: 17px;
  }

  &__wrapper {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    padding: 16px;
    gap: 16px;
    background: #ffffff;
    border-radius: 10px;
    min-height: 68vh;
  }

  &__header {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: stretch;
    flex-wrap: wrap;
    padding-bottom: 16px;
    border-bottom: 1px solid #e4e5f0;
    gap: 12px;
  }

  &__header-title {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;
    flex-grow: 1;

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
      color: #989cb1;
    }

    .current {
      color: #434657;
    }
  }

  &__header-title-content {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
  }
}

@media (min-width: 992px) {
  .configuration-page {
    padding: 20px;

    &__wrapper {
      padding: 32px;
    }
  }
}
</style>
