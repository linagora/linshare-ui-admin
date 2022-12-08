<script lang="ts" setup>
import TheSubheader from '@/core/components/the-subheader.vue';
import ArrowLeftIcon from '@/core/components/icons/arrow-left-icon.vue';
import ConfigDomainActions from '@/modules/configuration/components/config-domain-actions.vue';
import ConfigDomainRedirectAction from '@/modules/configuration/components/config-domain-redirect-action.vue';
import ConfigurationTabs from '@/modules/configuration/components/configuration-tabs.vue';

import DomainCreationFormModal, {
  DomainCreationFormModalProps,
} from '@/modules/domain/components/domain-creation-form-modal.vue';
import { EMPTY_DOMAIN } from '@/modules/domain/types/Domain';
import { DOMAIN_TYPE } from '@/modules/domain/types/Domain';
import LsButton from '@/core/components/ls/ls-button.vue';
import DeleteIcon from '@/core/components/icons/delete-icon.vue';
import { useRoute, useRouter } from 'vue-router';
import { computed, reactive } from 'vue';
import { useDomainStore } from '@/modules/domain/store';
import useDomainDelete from '@/modules/domain/hooks/useDomainDelete';

const domainStore = useDomainStore();
const currentDomainName = computed(() => domainStore.currentDomain.name);
const currentDomainUuid = computed(() => domainStore.currentDomain.uuid);
const currentDomainType = computed(() => domainStore.currentDomain.type);
const { deleting, confirmThenDelete, canDelete } = useDomainDelete();

const modalProps = reactive<DomainCreationFormModalProps>({ visible: false });

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

function showModal() {
  modalProps.visible = true;
  modalProps.parent = {
    name: currentDomainName.value,
    uuid: currentDomainUuid.value,
  };
  modalProps.type =
    currentDomainType.value === DOMAIN_TYPE.ROOT
      ? DOMAIN_TYPE.TOP
      : currentDomainType.value === DOMAIN_TYPE.TOP
      ? DOMAIN_TYPE.SUB
      : DOMAIN_TYPE.GUEST;
}

function onCreateCancel() {
  modalProps.visible = false;
  modalProps.parent = EMPTY_DOMAIN;
}

function onCreateSuccess() {
  modalProps.visible = false;
  modalProps.parent = EMPTY_DOMAIN;
  domainStore.fetchDomainsTree();
}
</script>
<template>
  <the-subheader :title="$t('NAVIGATOR.CONFIGURATION')" :detail="$t('CONFIGURATION.INTRODUCTION')">
    <template #action>
      <config-domain-actions v-if="isDomainSelected" @on-create-child-modal="showModal"> </config-domain-actions>
    </template>
  </the-subheader>
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
        <ls-button
          v-if="isInDomainDetail && canDelete"
          :disabled="loadingDomain"
          :loading="deleting"
          class="action"
          color="error"
          @click="confirmThenDelete"
        >
          <delete-icon class="icon"></delete-icon>
          <span class="desktop">{{ $t('DOMAIN.DELETE.BUTTON') }}</span>
        </ls-button>
      </div>
      <div class="configuration-page__body">
        <configuration-tabs v-if="isInDomainDetail"></configuration-tabs>
        <router-view></router-view>
      </div>
    </div>
  </div>
  <domain-creation-form-modal
    :visible="modalProps.visible"
    :type="modalProps.type"
    :parent="modalProps.parent"
    @cancel="onCreateCancel"
    @success="onCreateSuccess"
  ></domain-creation-form-modal>
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

  .action {
    padding-left: 12px;
    padding-right: 12px;
    margin-right: 4px;
  }

  &__body {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    gap: 16px;
  }

  &__header-title-content {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
  }

  .desktop {
    display: none;
  }
}

@media (min-width: 992px) {
  .configuration-page {
    padding: 20px;

    &__wrapper {
      padding: 32px;
    }

    .action {
      .icon {
        margin-right: 8px;
      }

      .desktop {
        display: block;
      }
    }
  }
}
</style>
