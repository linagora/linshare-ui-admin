<template>
  <div v-if="loadingDomain" class="spinner">
    <a-spin />
  </div>

  <a-row v-else :gutter="24">
    <a-col :span="12">
      <DomainForm :data="currentDomain" />
    </a-col>

    <a-col :span="10" :offset="2">
      <div class="info-block-container">
        <div class="info-block">
          <div class="title">
            {{ $t('GENERAL.CREATION_DATE') }}
          </div>
          <div class="value">
            {{ currentDomain.creationDate && $d(currentDomain.creationDate, 'mediumDate') }}
          </div>
        </div>
        <div class="info-block">
          <div class="title">
            {{ $t('GENERAL.MODIFICATION_DATE') }}
          </div>
          <div class="value">
            {{ currentDomain.modificationDate && $d(currentDomain.modificationDate, 'mediumDate') }}
          </div>
        </div>
        <div v-if="!isRootDomain" class="info-block">
          <div class="title">
            {{ $t('DOMAIN.FIELDS.WELCOME_MESSAGE') }}
          </div>
          <div class="value">
            <router-link
              :to="{
                name: CONFIGURATION_ROUTE_NAMES.DOMAIN_WELCOME_MESSAGE_DETAILS,
                params: { uuid: currentDomain?.welcomeMessage?.uuid || '', domainUuid: currentDomain.uuid },
              }"
            >
              {{ currentDomain.welcomeMessage?.name }}
            </router-link>
          </div>
        </div>
        <div v-if="!isRootDomain" class="info-block">
          <div class="title">
            {{ $t('DOMAIN.FIELDS.MAIL_CONFIGURATION') }}
          </div>
          <div class="value">
            <a href="">{{ currentDomain.mailConfiguration?.name }}</a>
          </div>
        </div>
        <div v-if="!isRootDomain" class="info-block">
          <div class="title">
            {{ $t('DOMAIN.FIELDS.MIME_POLICY') }}
          </div>
          <div class="value">
            <a href="">{{ currentDomain.mimePolicy?.name }}</a>
          </div>
        </div>
        <div v-if="!isRootDomain" class="info-block">
          <div class="title">
            {{ $t('DOMAIN.FIELDS.DOMAIN_POLICY') }}
          </div>
          <div class="value">
            <a href="">{{ currentDomain.domainPolicy?.name }}</a>
          </div>
        </div>
        <div class="info-block">
          <div class="title">
            {{ $t('DOMAIN.TYPE') }}
          </div>
          <div class="value">
            {{ $t(`DOMAIN.TYPES.${currentDomain.type}`) }}
          </div>
        </div>
      </div>
    </a-col>
  </a-row>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { STATUS } from '@/core/types/Status';
import { useDomainStore } from '@/modules/domain/store';
import DomainForm from '@/modules/configuration/pages/detail/components/domain-form.vue';
import { CONFIGURATION_ROUTE_NAMES } from '@/modules/configuration/router/index';

// composable
const domainStore = useDomainStore();
const { isRootDomain, currentDomain } = storeToRefs(domainStore);

// computed
const loadingDomain = computed(() => domainStore.getStatus('currentDomain') === STATUS.LOADING);
</script>

<style lang="less" scoped>
.spinner {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.info-block-container {
  display: flex;
  flex-wrap: wrap;
  border: 1px solid #f2f5f7;
  padding: 20px;
  border-radius: 4px;
  margin-top: 30px;

  .info-block {
    flex: 0 1 50%;
    margin: 20px 0;

    .title {
      color: @text-color-secondary;
    }
  }
}

.delete-domain-container {
  .ant-btn {
    background: @primary-8;
    color: @text-color-inverse;
  }
}
</style>
