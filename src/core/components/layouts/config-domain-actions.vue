<template>
  <div class="config-domain-actions">
    <div class="mobile">
      <ls-button class="detail-button" color="info" @click="onViewDetail">
        <detail-icon class="icon"></detail-icon>
      </ls-button>
      <div v-if="mobileMenu" ref="mobileMenuTarget" class="config-menu">
        <ls-button type="text" class="action" @click="onCreateChildDomain"> Create Child domain </ls-button>
        <ls-button type="text" class="action" @click="onViewDomainDetail"> View details </ls-button>
        <ls-button type="text" class="action" color="error" @click="onDeleteSelectedDomain"> Delete </ls-button>
      </div>
    </div>
    <div class="desktop">
      <ls-button color="info" @click="onViewDomainDetail">
        <view-icon class="icon"></view-icon>
        View details
      </ls-button>
      <ls-button color="info" @click="onCreateChildDomain">
        <plus-icon class="icon"></plus-icon>
        Create Child domain
      </ls-button>
      <ls-button color="error" @click="onDeleteSelectedDomain">
        <delete-icon class="icon"></delete-icon>
        Delete
      </ls-button>
    </div>
  </div>
</template>
<script lang="ts" setup>
import DeleteIcon from '@/core/components/icons/delete-icon.vue';
import ViewIcon from '@/core/components/icons/view-icon.vue';
import PlusIcon from '@/core/components/icons/plus-icon.vue';
import DetailIcon from '@/core/components/icons/detail-icon.vue';
import LsButton from '@/core/components/ls/ls-button.vue';
import { useRoute, useRouter } from 'vue-router';
import { computed, ref } from 'vue';
import { useDomainStore } from '@/modules/domain/store';
import { onClickOutside } from '@vueuse/core';

const emits = defineEmits(['on-create-child-modal']);
const router = useRouter();
const domainStore = useDomainStore();

const currentDomainUuid = computed(() => domainStore.currentDomain.uuid);
const mobileMenu = ref(false);
const mobileMenuTarget = ref(null);

function onViewDomainDetail() {
  router.push({ name: 'ConfigurationDomainQuota', params: { domainUuid: currentDomainUuid.value } });
}

onClickOutside(mobileMenuTarget, (event) => {
  mobileMenu.value = false;
});

function onCreateChildDomain() {
  emits('on-create-child-modal');
}

function onDeleteSelectedDomain() {
  mobileMenu.value = false;
}

function onViewDetail() {
  mobileMenu.value = !mobileMenu.value;
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
