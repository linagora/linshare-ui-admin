<template>
  <div class="content-detail-page">
    <div class="content-detail-page__title">
      <email-content-detail-header
        :editable="isEditable"
        :editing="editing"
        @edit-toggle="onToggleEditState"
      ></email-content-detail-header>
    </div>
    <div class="content-detail-page__body">
      <div class="content-detail-page__body-summary">
        <div class="content-detail-page__body-summary-config">
          <email-content-detail-card :editable="isEditable" :editing="editing"></email-content-detail-card>
        </div>
      </div>
      <div class="content-detail-page__body-summary-system">
        <system-information-card :item="activeMailContent"></system-information-card>
      </div>
    </div>
  </div>
  <div class="content-detail-page__action">
    <email-content-detail-actions
      :editable="isEditable"
      :editing="editing"
      :loading="loading"
      @cancel="onCancelEmailContent"
      @save="onUpdateEmailContent"
      @reset="onResetEmailContent"
    ></email-content-detail-actions>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import EmailContentDetailHeader from '@/modules/configuration/pages/email-templates/components/email-content/detail-page/email-content-detail-header.vue';
import EmailContentDetailCard from '@/modules/configuration/pages/email-templates/components/email-content/detail-page/email-content-detail-card.vue';
import EmailContentDetailActions from '@/modules/configuration/pages/email-templates/components/email-content/detail-page/email-content-detail-actions.vue';
import SystemInformationCard from '@/modules/configuration/pages/email-templates/components/email-content/detail-page/email-content-information-card.vue';
import useEmailTemplatesContent from '@/modules/configuration/pages/email-templates/hooks/useEmailTemplatesContent';
import { MailContent } from '../types/MailContent';
import { useRoute } from 'vue-router';

const route = useRoute();
const {
  loading,
  activeMailContent,
  handleGetMailContentDetail,
  handleUpdateMailContent,
  handleResetEmailContent,
  checkingEmailContentsDomainAuthorized,
  onCheckDefaultEmailContent,
} = useEmailTemplatesContent();

// data
const editing = ref(false);

// computed

const isDefaultEmailContent = computed(() => {
  return onCheckDefaultEmailContent(activeMailContent.value);
});
const isEditable = computed(() => {
  return checkingEmailContentsDomainAuthorized(activeMailContent.value.domain);
});
// methods
function onToggleEditState() {
  editing.value = !editing.value;
}

async function onUpdateEmailContent() {
  const payload: MailContent = {
    ...activeMailContent.value,
  };

  await handleUpdateMailContent(payload);
  handleGetMailContentDetail(route.params.id.toString());
  onToggleEditState();
}

function onResetEmailContent() {
  handleResetEmailContent();
}
function onCancelEmailContent() {
  handleGetMailContentDetail(route.params.id.toString());
  onToggleEditState();
}
onMounted(async () => {
  handleGetMailContentDetail(route.params.id.toString());
});
</script>

<style lang="less">
.content-detail-page {
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
