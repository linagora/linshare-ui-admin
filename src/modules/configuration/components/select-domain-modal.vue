<template>
  <ls-modal class="select-domain-modal" :footer="null">
    <template #title>
      <strong class="title">{{ $t('CONFIGURATION.SELECT_DOMAIN') }}</strong>
    </template>
    <template #centered>
      <div class="select-domain-modal__search">
        <div class="search">
          <a-input
            v-model:value="searchBox"
            class="ls-input"
            :placeholder="$t('CONFIGURATION.ENTER_DOMAIN_NAME')"
          ></a-input>
        </div>
        <div class="suggestion">
          <span>{{ $t('CONFIGURATION.SUGGESTED_DOMAINS') }}</span>
          <a-button
            v-for="(domain, index) in suggestedDomains"
            :key="index + '_suggested-domain'"
            class="ls-button"
            @click="onSelectSuggestedDomain(domain)"
            >{{ domain.name }}</a-button
          >
        </div>
      </div>
      <div class="select-domain-modal__content ls-scrollbar">
        <ls-domain-treeview
          v-if="domainsTreeBySearch"
          :level="1"
          :is-root="true"
          :node="domainsTreeBySearch"
          :active-node="selectedDomain"
          @select="onSelectDomain"
        ></ls-domain-treeview>
        <div v-else class="not-found">
          <empty-icon width="44" height="44"></empty-icon>
          <span>{{ $t('CONFIGURATION.DOMAIN_NOT_FOUND') }}</span>
        </div>
      </div>
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
import EmptyIcon from '@/core/components/icons/empty-icon.vue';
// props/emits
const props = defineProps({
  openModal: Boolean,
});
const emits = defineEmits(['close']);

// composables
const router = useRouter();
const route = useRoute();
const domainStore = useDomainStore();
const { domainsTree, getCurrentDomain, getCurrentDomainParent, getDomainByUuid } = storeToRefs(domainStore);

// data
const selectedDomain = ref();
const searchBox = ref('');

// computed
const currentDomainUuid = computed(() => domainStore.currentDomain.uuid);

const suggestedDomains = computed(() => {
  let suggested: DomainTreeNode[] = [];
  const SUGGESTED_LIMIT = 2;

  const currentDomainTree = getDomainByUuid.value(currentDomainUuid.value);

  const suggestedSiblingDomains =
    getCurrentDomainParent.value?.children?.filter((item) => item.uuid !== currentDomainUuid.value) || [];
  suggested = [...suggestedSiblingDomains];

  if (suggestedSiblingDomains?.length === 0) {
    const suggestedChildDomains = currentDomainTree?.children || [];
    suggested = [...suggestedChildDomains];
  }

  return suggested.slice(0, SUGGESTED_LIMIT) || [];
});

const domainsTreeBySearch = computed(() => {
  const treeArr = filterDomainsTree([domainsTree.value], searchBox.value);
  return treeArr[0];
});
// methods
function onCloseModal() {
  emits('close');
}

function onViewDomainDetail() {
  if (selectedDomain.value.uuid !== getCurrentDomain.value.uuid) {
    domainStore.setCurrentDomain(selectedDomain.value);
    if (route.params.domainUuid) {
      router.push({
        name: route.name || undefined,
        params: { ...route.params, domainUuid: selectedDomain.value.uuid },
      });
    } else {
      router.push({
        name: 'ConfigurationDomainDetail',
        params: { ...route.params, domainUuid: currentDomainUuid.value },
      });
    }
  }
  emits('close');
}

function onSelectDomain(domain: DomainTreeNode) {
  selectedDomain.value = domain;
}

function onSelectSuggestedDomain(domain: DomainTreeNode) {
  onSelectDomain(domain);
  onViewDomainDetail();
}

function filterDomainsTree(array: DomainTreeNode[], text: string) {
  const getNodes = (result: DomainTreeNode[], object: DomainTreeNode) => {
    if (object.name?.includes(text)) {
      result.push(object);
      return result;
    }
    if (Array.isArray(object.children)) {
      const nodes = object.children.reduce(getNodes, []);
      if (nodes.length) result.push({ ...object, children: nodes });
    }
    return result;
  };

  return array.reduce(getNodes, []);
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

  &__content {
    height: 400px;
    max-height: 400px;
    overflow: hidden;
    overflow-y: auto;
    margin: 16px 0 24px;
  }

  &__content .not-found {
    margin-top: 48px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  &__content .not-found span {
    font-size: 14px;
    opacity: 0.4;
  }

  &__search {
    padding-bottom: 16px;
    border-bottom: 1px solid #e4e5f0;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    gap: 16px;
  }

  &__search .suggestion {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }

  &__search .search .ls-input {
    padding: 12px;
    height: 44px;
    background: #f7f7fa;
    border: 1px solid #e4e5f0;
    border-radius: 10px;
  }

  &__search .suggestion .ls-button {
    padding: 6px 12px;
    height: 32px;
    background: #f3f3f7;
    border-radius: 6px;
    font-style: normal;
    font-weight: 500;
    font-size: 15px;
    line-height: 20px;
    text-align: center;
    color: #1b1d29;
  }
}
</style>
