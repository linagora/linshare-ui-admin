<template>
  <ls-modal class="select-domain-modal" :footer="null">
    <template #title>
      <strong class="title">{{ $t('CONFIGURATION.SELECT_DOMAIN') }}</strong>
    </template>
    <template #centered>
      <ls-domain-treeview
        :level="1"
        :is-root="true"
        :node="domainsTree"
        :active-node="selectedDomain"
        @select="onSelectDomain"
      ></ls-domain-treeview>
    </template>
    <template #footer>
      <div class="actions">
        <ls-button class="action" color="info" @click="onCloseModal">{{ $t('CONFIGURATION.CANCEL') }}</ls-button>
        <ls-button class="action" color="info" type="primary" @click="onViewDomainDetail">{{
          $t('CONFIGURATION.VIEW')
        }}</ls-button>
      </div>
    </template>
  </ls-modal>
</template>
<script lang="ts" setup>
import { computed, ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useRoute, useRouter } from 'vue-router';
import { useDomainStore } from '@/modules/domain/store';
import LsModal from '@/core/components/ls/ls-modal.vue';
import LsButton from '@/core/components/ls/ls-button.vue';
import DomainTreeNode from '@/modules/domain/types/DomainTreeNode';
import LsDomainTreeview from '@/core/components/ls/ls-domain-treeview.vue';

// props/emits
const props = defineProps({
  openModal: Boolean,
});
const emits = defineEmits(['close']);

// composables
const router = useRouter();
const route = useRoute();
const domainStore = useDomainStore();
const { domainsTree, getCurrentDomain } = storeToRefs(domainStore);

// data
const selectedDomain = ref();

// data
const currentDomainUuid = computed(() => domainStore.currentDomain.uuid);

// methods
function onCloseModal() {
  emits('close');
}

function onViewDomainDetail() {
  domainStore.setCurrentDomain(selectedDomain.value);
  if (route.params.domainUuid) {
    router.push({ name: route.name || undefined, params: { domainUuid: selectedDomain.value.uuid } });
  } else {
    router.push({ name: 'ConfigurationDomainDetail', params: { domainUuid: currentDomainUuid.value } });
  }
  emits('close');
}

function onSelectDomain(domain: DomainTreeNode) {
  selectedDomain.value = domain;
}

// hook
watch(
  () => props.openModal,
  (newVal) => {
    if (newVal) {
      selectedDomain.value = getCurrentDomain.value;
    }
  }
);
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
