<template>
  <div class="footer-detail-page">
    <div class="footer-detail-page__title">
      <email-footer-detail-header
        :editable="isEditable"
        :editing="editing"
        @edit-toggle="onToggleEditState"
      ></email-footer-detail-header>
    </div>
    <div class="footer-detail-page__body">
      <div class="footer-detail-page__body-summary">
        <div class="footer-detail-page__body-summary-config">
          <email-footer-detail-card :editable="isEditable" :editing="editing"></email-footer-detail-card>
        </div>
      </div>
      <div class="footer-detail-page__body-summary-system">
        <system-information-card :item="activeMailFooter"></system-information-card>
      </div>
    </div>
  </div>
  <div class="footer-detail-page__action">
    <email-footer-detail-actions
      :editable="isEditable"
      :editing="editing"
      :loading="loading"
      @cancel="onCancelEmailFooter"
      @save="onUpdateEmailFooter"
      @reset="onResetEmailFooter"
    ></email-footer-detail-actions>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import EmailFooterDetailHeader from '@/modules/configuration/pages/email-templates/components/email-footer/detail-page/email-footer-detail-header.vue';
import EmailFooterDetailCard from '@/modules/configuration/pages/email-templates/components/email-footer/detail-page/email-footer-detail-card.vue';
import EmailFooterDetailActions from '@/modules/configuration/pages/email-templates/components/email-footer/detail-page/email-footer-detail-actions.vue';
import SystemInformationCard from '@/modules/configuration/pages/email-templates/components/email-footer/detail-page/email-footer-information-card.vue';
import useEmailTemplatesFooter from '@/modules/configuration/pages/email-templates/hooks/useEmailTemplatesFooter';
import { MailFooter } from '../types/MailFooter';
import { useRoute } from 'vue-router';

const route = useRoute();
const {
  loading,
  activeMailFooter,
  handleGetMailFooterDetail,
  handleUpdateMailFooter,
  handleResetEmailFooter,
  checkingEmailFootersDomainAuthorized,
  onCheckDefaultEmailFooter,
} = useEmailTemplatesFooter();

// data
const editing = ref(false);

// computed

const isDefaultEmailFooter = computed(() => {
  return onCheckDefaultEmailFooter(activeMailFooter.value);
});
const isEditable = computed(() => {
  return checkingEmailFootersDomainAuthorized(activeMailFooter.value.domain) && !isDefaultEmailFooter.value;
});
// methods
function onToggleEditState() {
  editing.value = !editing.value;
}

async function onUpdateEmailFooter() {
  const payload: MailFooter = {
    ...activeMailFooter.value,
  };

  await handleUpdateMailFooter(payload);
  onToggleEditState();
}

function onResetEmailFooter() {
  handleResetEmailFooter();
}
function onCancelEmailFooter() {
  handleGetMailFooterDetail(route.params.id.toString());
  onToggleEditState();
}
onMounted(async () => {
  handleGetMailFooterDetail(route.params.id.toString());
});
</script>

<style lang="less">
.footer-detail-page {
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
