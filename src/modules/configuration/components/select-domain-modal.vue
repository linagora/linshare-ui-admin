<template>
  <ls-modal class="select-domain-modal" :footer="null">
    <template #title>
      <strong class="title">Select domain</strong>
    </template>
    <template #centered>
      <ls-domain-treeview :node="domainsTree" :is-root="true" :level="1"></ls-domain-treeview>
    </template>
    <template #footer>
      <div class="actions">
        <ls-button class="action" color="info" @click="onCloseModal">Cancel</ls-button>
        <ls-button class="action" color="info" type="primary" @click="onViewDomainDetail">View Details</ls-button>
      </div>
    </template>
  </ls-modal>
</template>
<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { useDomainStore } from '@/modules/domain/store';
import LsModal from '@/core/components/ls/ls-modal.vue';
import LsButton from '@/core/components/ls/ls-button.vue';
import LsDomainTreeview from '@/core/components/ls/ls-domain-treeview.vue';
import { useRouter } from 'vue-router';
import { computed } from 'vue';

const emits = defineEmits(['close']);
const router = useRouter();
const domainStore = useDomainStore();
const { domainsTree } = storeToRefs(domainStore);
const currentDomainUuid = computed(() => domainStore.currentDomain.uuid);

function onViewDomainDetail() {
  router.push({ name: 'ConfigurationDomainDetail', params: { domainUuid: currentDomainUuid.value } });
}

function onCloseModal() {
  emits('close');
}
</script>
<style lang="less">
.select-domain-modal {
  .title {
    font-style: normal;
    font-weight: 600;
    font-size: 20px;
    line-height: 24px;
    display: block;
    text-align: center;
    color: #1b1d29;
    padding: 16px;
  }

  .actions {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
  }

  .actions .action {
    flex-grow: 1;
    text-align: center;
    justify-content: center;
  }
}
</style>
