<template>
  <div class="layout-detail-page">
    <div class="layout-detail-page__title">
      <email-layout-detail-header
        :editable="isEditable"
        :editing="editing"
        @edit-toggle="onToggleEditState"
      ></email-layout-detail-header>
    </div>
    <div class="layout-detail-page__body">
      <div class="layout-detail-page__body-summary">
        <div class="layout-detail-page__body-summary-config">
          <email-layout-detail-card :editable="isEditable" :editing="editing"></email-layout-detail-card>
        </div>
      </div>
      <div class="layout-detail-page__body-summary-system">
        <system-information-card :item="activeMailLayout"></system-information-card>
      </div>
    </div>
  </div>
  <div class="layout-detail-page__action">
    <email-layout-detail-actions
      :editable="isEditable"
      :editing="editing"
      :loading="loading"
      @cancel="onCancelEmailLayout"
      @save="onUpdateEmailLayout"
      @reset="onResetEmailLayout"
    ></email-layout-detail-actions>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import EmailLayoutDetailHeader from '@/modules/configuration/pages/email-templates/components/email-layout/detail-page/email-layout-detail-header.vue';
import EmailLayoutDetailCard from '@/modules/configuration/pages/email-templates/components/email-layout/detail-page/email-layout-detail-card.vue';
import EmailLayoutDetailActions from '@/modules/configuration/pages/email-templates/components/email-layout/detail-page/email-layout-detail-actions.vue';
import SystemInformationCard from '@/modules/configuration/pages/email-templates/components/email-layout/detail-page/email-layout-information-card.vue';
import useEmailTemplatesLayout from '@/modules/configuration/pages/email-templates/hooks/useEmailTemplatesLayout';
import { MailLayout } from '../types/MailLayout';
import { useRoute } from 'vue-router';

const route = useRoute();
const {
  loading,
  activeMailLayout,
  handleGetMailLayoutDetail,
  handleUpdateMailLayout,
  handleResetEmailLayout,
  checkingEmailLayoutsDomainAuthorized,
  onCheckDefaultEmailLayout,
} = useEmailTemplatesLayout();

// data
const editing = ref(false);

// computed

const isDefaultEmailLayout = computed(() => {
  return onCheckDefaultEmailLayout(activeMailLayout.value);
});
const isEditable = computed(() => {
  return checkingEmailLayoutsDomainAuthorized(activeMailLayout.value.domain) && !isDefaultEmailLayout.value;
});
// methods
function onToggleEditState() {
  editing.value = !editing.value;
}

async function onUpdateEmailLayout() {
  const payload: MailLayout = {
    ...activeMailLayout.value,
  };

  await handleUpdateMailLayout(payload);
  onToggleEditState();
}

function onResetEmailLayout() {
  handleResetEmailLayout();
}
function onCancelEmailLayout() {
  handleGetMailLayoutDetail(route.params.id.toString());
  onToggleEditState();
}
onMounted(async () => {
  handleGetMailLayoutDetail(route.params.id.toString());
});
</script>

<style lang="less">
.layout-detail-page {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
  gap: 16px;

  &__title {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: center;
    gap: 24px;
    width: 100%;
  }

  &__body {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
  }

  &__body-summary {
    display: flex;
    justify-content: space-between;
    width: 90%;
  }

  &__body-summary-config {
    width: 95%;
  }

  &__body-summary-system {
    width: 35%;
  }

  &__action {
    width: 100%;
  }
}

.ls-detail {
  width: 32px;
  height: 32px;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f2f8ff;
  border: 1px solid #a3dcff;
  color: #007aff;
  border-radius: 7px;
  transform: rotate(90deg);
}
</style>
