<template>
  <div class="mime-policy-detail-page">
    <div class="mime-policy-detail-page__header">
      <mime-detail-header
        :editable="isEditable"
        :editing="editing"
        @edit-toggle="onToggleEditState"
      ></mime-detail-header>
    </div>
    <div class="mime-policy-detail-page__content">
      <div class="mime-policy-detail-page__detail">
        <mime-detail-card
          :editable="isEditable"
          :editing="editing"
          :item="activeMimePolicy"
          :loading="loading"
          @cancel="onToggleEditState"
          @save="onUpdateMimePolicy($event)"
        ></mime-detail-card>
      </div>
      <div class="mime-policy-detail-page__types">
        <mime-types-table
          :editable="isEditable"
          :status="status"
          :items="mimeTypes"
          @toggle-all="onToggleAllTypes"
          @toggle="onUpdateMimeTypeState($event)"
        ></mime-types-table>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import { MimePolicy, MimeType } from '@/modules/configuration/pages/type-mime-policies/types/MimeType';
import useMimesPolicies from '@/modules/configuration/pages/type-mime-policies/hooks/useMimePolicies';
import MimeDetailCard from '@/modules/configuration/pages/type-mime-policies/components/detail-page/mime-detail-card.vue';
import MimeTypesTable from '@/modules/configuration/pages/type-mime-policies/components/detail-page/mime-types-table.vue';
import MimeDetailHeader from '@/modules/configuration/pages/type-mime-policies/components/detail-page/mime-detail-header.vue';

// composable
const route = useRoute();
const {
  handleGetMimePolicy,
  handleUpdateMimeType,
  handleUpdateMimePolicy,
  enableAllMimeTypesInMimePolicy,
  disableAllMimeTypesInMimePolicy,
  checkingMimePolicyDomainAuthorized,
  activeMimePolicy,
  status,
  loading,
} = useMimesPolicies();

const mimePolicyUuid = computed(() => {
  return route?.params?.mimePolicyUuid ?? activeMimePolicy.value?.uuid;
});

const mimeTypes = computed(() => {
  return activeMimePolicy.value?.mimeTypes ?? [];
});

const isEditable = computed(() => {
  return checkingMimePolicyDomainAuthorized(activeMimePolicy.value);
});

// data
const editing = ref(false);

// methods
function onToggleEditState() {
  editing.value = !editing.value;
}
function fetchingMimePolicyDetail() {
  handleGetMimePolicy(mimePolicyUuid.value.toString());
}

async function onUpdateMimePolicy(name: string) {
  if (!name) {
    return;
  }
  const payload: MimePolicy = { ...activeMimePolicy.value, name } as MimePolicy;

  const result = await handleUpdateMimePolicy(payload);

  if (result) {
    onToggleEditState();
    fetchingMimePolicyDetail();
  }
}

async function onToggleAllTypes(state: boolean) {
  if (state) {
    await enableAllMimeTypesInMimePolicy(mimePolicyUuid.value.toString());
  } else {
    await disableAllMimeTypesInMimePolicy(mimePolicyUuid.value.toString());
  }
  await handleGetMimePolicy(mimePolicyUuid.value.toString());
}

async function onUpdateMimeTypeState(event: { item: MimeType; state: boolean }) {
  const payload: MimeType = { ...event.item, enable: event.state };

  await handleUpdateMimeType(payload);
}

// hook call
fetchingMimePolicyDetail();
</script>
<style lang="less">
.mime-policy-detail-page {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;

  &__content {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: stretch;
    gap: 24px;
  }
  &__detail,
  &__types {
    width: 50%;
  }
  &__types {
    padding-top: 21px;
  }
}
</style>
