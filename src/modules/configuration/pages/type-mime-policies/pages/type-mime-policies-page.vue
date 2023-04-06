<template>
  <div class="type-mime-policies-page">
    <div>
      <a-alert closable>
        <template #description>
          <ul>
            <li>{{ $t('MIME_POLICIES.CREATE_DESCRIPTION') }}</li>
            <li>{{ $t('MIME_POLICIES.FILTER_DESCRIPTION') }}</li>
            <li>{{ $t('MIME_POLICIES.ENABLED_DESCRIPTION') }}</li>
            <li
              v-html="
                $t('MIME_POLICIES.MANAGE_DESCRIPTION', {
                  domain_link: `${$t('MIME_POLICIES.MANAGE_DOMAIN')}`,
                  url: `${domainLink}/configuration/${currentDomain.uuid}/detail`,
                })
              "
            ></li>
          </ul>
        </template>
      </a-alert>
    </div>
    <div class="actions">
      <a-input v-model:value="filterText" :placeholder="$t('MIME_POLICIES.SEARCH_BY')" class="searchbox" allow-clear>
        <template #prefix>
          <SearchOutlined />
        </template>
      </a-input>
      <mime-policies-actions @create="toggleModal"></mime-policies-actions>
    </div>
  </div>
  <MimesTable></MimesTable>
  <ThePagination v-model="pagination" class="pagination" :is-visible="!!filteredList.length" />
  <CreationModal :visible="setCreationModal.opened" @close="toggleModal()" @refresh="onFetchMimePolicies()">
  </CreationModal>
  <a-modal
    v-model:visible="modal.visible"
    :closable="false"
    :footer="null"
    wrap-class-name="type-mime-policies-page__modal"
  >
    <delete-mime-policy-card
      v-if="modal.type === 'DELETE_MIME_MODAL'"
      @close="onCloseModal"
      @refresh="onFetchMimePolicies"
    ></delete-mime-policy-card>
    <delete-mime-policies-card
      v-if="modal.type === 'DELETE_MIME_POLICIES_MODAL'"
      @close="onCloseModal"
      @refresh="onFetchMimePolicies"
    ></delete-mime-policies-card>
    <delete-mime-policies-fail-card
      v-if="modal.type === 'DELETE_MIME_POLICIES_FAIL_MODAL'"
      @close="onCloseModal"
      @refresh="onFetchMimePolicies"
    ></delete-mime-policies-fail-card>
  </a-modal>
  <a-modal
    v-model:visible="assignModal.visible"
    :closable="false"
    :footer="null"
    wrap-class-name="type-mime-policies-page__modal"
  >
    <AssignMinePolicyCard @close="onCloseAssignModal" @refresh="assignReload"></AssignMinePolicyCard>
  </a-modal>
</template>
<script lang="ts" setup>
import { reactive } from 'vue';
import { storeToRefs } from 'pinia';
import { useRoute } from 'vue-router';
import { computed, watch } from 'vue';
import { SearchOutlined } from '@ant-design/icons-vue';
import { useDomainStore } from '@/modules/domain/store';
import ThePagination from '@/core/components/the-pagination.vue';
import CreationModal from '../components/mime-policies-creation-modal.vue';
import useMimesPolicies from '@/modules/configuration/pages/type-mime-policies/hooks/useMimePolicies';
import DeleteMimePolicyCard from '@/modules/configuration/pages/type-mime-policies/components/delete-mime-policy-card.vue';
import MimesTable from '@/modules/configuration/pages/type-mime-policies/components/mime-policies-table.vue';
import MimePoliciesActions from '@/modules/configuration/pages/type-mime-policies/components/mime-policies-actions.vue';
import DeleteMimePoliciesCard from '@/modules/configuration/pages/type-mime-policies/components/delete-mime-policies-card.vue';
import DeleteMimePoliciesFailCard from '@/modules/configuration/pages/type-mime-policies/components/delete-mime-policies-fail-card.vue';
import AssignMinePolicyCard from '@/modules/configuration/pages/type-mime-policies/components/assign-mime-policy-card.vue';

// composable
const domainLink = window.location.origin;
const route = useRoute();
const domainStore = useDomainStore();
const { currentDomain } = storeToRefs(domainStore);
const {
  modal,
  filterText,
  pagination,
  filteredList,
  onCloseModal,
  getMimePoliciesList,
  assignModal,
  onCloseAssignModal,
} = useMimesPolicies();

//data
const currentDomainUuid = computed(() => {
  return route.params.domainUuid.toString() ?? currentDomain.value.uuid;
});
const setCreationModal = reactive({
  opened: false,
});

// method
function toggleModal() {
  setCreationModal.opened = !setCreationModal.opened;
}

async function onFetchMimePolicies() {
  await getMimePoliciesList(currentDomainUuid.value);
}

function assignReload() {
  domainStore.fetchDomain();
}

// hooks
onFetchMimePolicies();
watch(route, (newRoute) => {
  if (newRoute) {
    onFetchMimePolicies();
  }
});
</script>

<style lang="less" scoped>
.actions {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  margin-top: 20px;
}

.actions > .searchbox {
  width: 500px;
  margin-right: 10px;
}
</style>
<style lang="less">
.type-mime-policies-page {
  background-color: transparent;

  &__modal .ant-modal-content {
    background: #ffffff;
    box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.08), 0px 8px 8px rgba(0, 0, 0, 0.16);
    border-radius: 16px;
    overflow: hidden;
  }

  &__modal .ant-modal-body {
    padding: 0;
  }
}
</style>
<style lang="less">
.type-mime-policies-page {
  background-color: transparent;

  &__modal .ant-modal-content {
    background: #ffffff;
    box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.08), 0px 8px 8px rgba(0, 0, 0, 0.16);
    border-radius: 16px;
    overflow: hidden;
  }

  &__modal .ant-modal-body {
    padding: 0;
  }
}
</style>
