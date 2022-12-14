<template>
  <div class="config-domain-actions">
    <div class="mobile">
      <ls-button class="detail-button" color="info" @click="onViewDetail">
        <detail-icon class="icon"></detail-icon>
      </ls-button>
      <div v-if="mobileMenu" ref="mobileMenuTarget" class="config-menu">
        <ls-button type="text" class="action" :disabled="createDomainButton.disabled" @click="onCreateChildDomain">
          {{ $t('DOMAIN.CREATE_DOMAIN') }}
        </ls-button>
        <ls-button type="text" class="action" @click="openSelectDomainModal = true">
          {{ $t('DOMAIN.SELECT_DOMAIN') }}
        </ls-button>
      </div>
    </div>
    <div class="desktop">
      <ls-button color="info" :disabled="createDomainButton.disabled" @click="onCreateChildDomain">
        <plus-icon class="icon"></plus-icon>
        {{ $t('DOMAIN.CREATE_DOMAIN') }}
      </ls-button>
      <ls-button color="info" @click="openSelectDomainModal = true">
        <globe-icon class="icon"></globe-icon>
        {{ $t('DOMAIN.SELECT_DOMAIN') }}
      </ls-button>
    </div>
    <select-domain-modal
      v-model:visible="openSelectDomainModal"
      :open-modal="openSelectDomainModal"
      @close="openSelectDomainModal = false"
    ></select-domain-modal>
  </div>
</template>
<script lang="ts" setup>
import { ref, reactive, watch } from 'vue';
import { onClickOutside } from '@vueuse/core';
import { useDomainStore } from '@/modules/domain/store';
import LsButton from '@/core/components/ls/ls-button.vue';
import PlusIcon from '@/core/components/icons/plus-icon.vue';
import GlobeIcon from '@/core/components/icons/globe-icon.vue';
import DetailIcon from '@/core/components/icons/detail-icon.vue';
import SelectDomainModal from '@/modules/configuration/components/select-domain-modal.vue';

// composables
const emits = defineEmits(['on-create-child-modal']);
const domainStore = useDomainStore();

// data
const mobileMenu = ref(false);
const mobileMenuTarget = ref(null);
const openSelectDomainModal = ref(false);
const createDomainButton = reactive({
  disabled: false,
});

// hooks
onClickOutside(mobileMenuTarget, (event) => {
  mobileMenu.value = false;
});
watch(() => domainStore.currentDomain, onDomainChanged);

// methods
function onCreateChildDomain() {
  emits('on-create-child-modal');
}

function onViewDetail() {
  mobileMenu.value = !mobileMenu.value;
}

function onDomainChanged() {
  //for the root domain we can create any number of subdomain
  if (domainStore.isGuestDomain || domainStore.isSubDomain) {
    createDomainButton.disabled = true;
  } else {
    createDomainButton.disabled = false;
  }
}
</script>
<style lang="less">
.config-domain-actions {
  .desktop {
    display: none;
  }

  .mobile {
    display: flex;
    position: relative;

    .detail-button {
      padding-left: 12px;
      padding-right: 12px;
    }

    .config-menu {
      position: absolute;
      top: 100%;
      right: 0;
      padding: 16px;
      background-color: #fff;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: stretch;
      gap: 4px;
      box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.08), 0px 8px 24px rgba(0, 0, 0, 0.08);
      border-radius: 8px;
      z-index: 2;
    }
    .config-menu .action {
      text-align: left;
    }
  }
}

@media (min-width: 992px) {
  .config-domain-actions {
    .desktop {
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
      align-items: center;
      gap: 20px;

      .icon {
        margin-right: 12px;
      }
    }

    .mobile {
      display: none;
    }
  }
}
</style>
