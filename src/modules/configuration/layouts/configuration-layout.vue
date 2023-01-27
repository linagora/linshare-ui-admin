<script lang="ts" setup>
import { useRoute } from 'vue-router';
import { STATUS } from '@/core/types/Status';
import { computed, reactive, watch } from 'vue';
import { useDomainStore } from '@/modules/domain/store';
import useBreadcrumbs from '@/core/hooks/useBreadcrumbs';
import { EMPTY_DOMAIN, DOMAIN_TYPE } from '@/modules/domain/types/Domain';
import LsButton from '@/core/components/ls/ls-button.vue';
import TheSubheader from '@/core/components/the-subheader.vue';
import DeleteIcon from '@/core/components/icons/delete-icon.vue';
import useDomainDelete from '@/modules/domain/hooks/useDomainDelete';
import DomainCreationFormModal, {
  DomainCreationFormModalProps,
} from '@/modules/domain/components/domain-creation-form-modal.vue';
import ConfigurationTabs from '@/modules/configuration/components/configuration-tabs.vue';
import ConfigDomainActions from '@/modules/configuration/components/config-domain-actions.vue';

// composables
const routeInstance = useRoute();
const domainStore = useDomainStore();
const { deleting, confirmThenDelete, canDelete } = useDomainDelete();
const { breadcrumbs } = useBreadcrumbs();
// data
const modalProps = reactive<DomainCreationFormModalProps>({ visible: false });

// computed
const currentDomainName = computed(() => domainStore.currentDomain.name);
const currentDomainUuid = computed(() => domainStore.currentDomain.uuid);
const currentDomainType = computed(() => domainStore.currentDomain.type);
const topMostDomain = computed(() => domainStore.topMostDomain);
const isEntriesConfigurationPage = computed(() => {
  return !!routeInstance.params?.domainUuid;
});
const loadingDomain = computed(() => domainStore.getStatus('currentDomain') === STATUS.LOADING);

const breadcrumbsWithDomain = computed(() => {
  const newBreadcrumbs = [
    {
      label: 'NAVIGATOR.CONFIGURATION',
      path: 'ConfigurationDomainDetail',
      params: {
        domainUuid: topMostDomain.value?.uuid,
      },
    },
    {
      label: currentDomainName.value as string,
      path: 'ConfigurationDomainDetail',
    },
    ...breadcrumbs.value.slice(1),
  ];
  return newBreadcrumbs;
});

// methods
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

// hook
watch(currentDomainUuid, async (newVal) => {
  if (newVal) {
    await domainStore.fetchDomain();
  }
});
</script>
<template>
  <the-subheader :title="$t('NAVIGATOR.CONFIGURATION')" :detail="$t('CONFIGURATION.INTRODUCTION')">
    <template #action>
      <config-domain-actions @on-create-child-modal="showModal"> </config-domain-actions>
    </template>
  </the-subheader>
  <div class="configuration-page">
    <div class="configuration-page__wrapper">
      <div class="configuration-page__header">
        <div class="configuration-page__header-title">
          <div class="configuration-page__header-title-content">
            <strong class="title">{{ $t('CONFIGURATION.MANAGE_DOMAINS') }}</strong>
            <a-breadcrumb class="breakcrumb" :routes="breadcrumbsWithDomain">
              <template #itemRender="{ route, routes }">
                <span v-if="routes.indexOf(route) === routes.length - 1" class="current">
                  {{ $t(route.label) }}
                </span>

                <router-link v-else :to="{ name: route.path, params: route?.params }">
                  {{ $t(route.label) }}
                </router-link>
              </template>
            </a-breadcrumb>
          </div>
        </div>
        <ls-button
          v-if="isEntriesConfigurationPage && canDelete"
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
        <configuration-tabs v-if="isEntriesConfigurationPage"></configuration-tabs>
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
    gap: 8px;
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
