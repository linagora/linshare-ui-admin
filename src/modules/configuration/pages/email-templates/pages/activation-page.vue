<template>
  <div class="email-templates-activation-page">
    <email-activation-table :status="status" :items="templatesBySearch"></email-activation-table>
  </div>
  <a-modal
    v-model:visible="modal.visible"
    :closable="false"
    :activation="null"
    wrap-class-name="email-templates-activation-page__modal"
    :destroy-on-close="true"
  >
    <!-- <DeleteMailActivationCard
      v-if="modal.type === 'DELETE_FOOTER_EMAIL'"
      @close="onCloseModal"
      @refresh="onFetchEmailActivations"
    ></DeleteMailActivationCard>
    <DeleteMailActivationsCard
      v-else-if="modal.type === 'DELETE_FOOTERS_EMAIL'"
      @close="onCloseModal"
      @refresh="onFetchEmailActivations"
    ></DeleteMailActivationsCard>
    <DeleteMailActivationsFailCard
      v-else-if="modal.type === 'DELETE_FOOTERS_FAIL_EMAIL'"
      @close="onCloseModal"
      @refresh="onFetchEmailActivations"
    ></DeleteMailActivationsFailCard>
    <create-mail-activation-card
      v-if="modal.type === 'CREATE_FOOTER_EMAIL'"
      @close="onCloseModal"
      @refresh="onFetchEmailActivations"
    ></create-mail-activation-card> -->
  </a-modal>
</template>
<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { useRoute } from 'vue-router';
import { computed, watch } from 'vue';
import { SearchOutlined } from '@ant-design/icons-vue';
import { useDomainStore } from '@/modules/domain/store';
import useEmailTemplatesActivation from '../hooks/useEmailTemplatesActivation';
import EmailActivationTable from '../components/email-activation/email-activation-table.vue';
import EmailActivationActions from '../components/email-activation/email-activation-actions.vue';
// import CreateMailActivationCard from '../components/email-activation/create-mail-activation-card.vue';
// import DeleteMailActivationCard from '../components/email-activation/delete-mail-activation-card.vue';
// import DeleteMailActivationsCard from '../components/email-activation/delete-mail-activations-card.vue';
// import DeleteMailActivationsFailCard from '../components/email-activation/delete-mail-activations-fail-card.vue';

//composable
const route = useRoute();
const { currentDomain } = storeToRefs(useDomainStore());
const {
  modal,
  status,
  list,
  filterText,
  onCreateMailActivation,
  onCloseModal,
  handleGetEmailActivationTemplates,
  resetSelectEmailActivations,
} = useEmailTemplatesActivation();

//computed

const templatesBySearch = computed(() => {
  if (!filterText.value) {
    return list.value;
  } else {
    return (
      list.value?.filter(
        (activation) =>
          activation.domain.toLowerCase().includes(filterText.value.toLowerCase()) ||
          activation.description?.toLowerCase().includes(filterText.value.toLowerCase())
      ) ?? []
    );
  }
});
const currentDomainUuid = computed(() => {
  return route.params.domainUuid.toString() ?? currentDomain.value.uuid;
});

// methods
async function onFetchEmailActivations() {
  await handleGetEmailActivationTemplates(currentDomainUuid.value, false);
  resetSelectEmailActivations();
}

watch(
  route,
  (newRoute) => {
    if (newRoute) {
      onFetchEmailActivations();
    }
  },
  {
    immediate: true,
  }
);
</script>
<style lang="less">
.email-templates-activation-page {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
  gap: 16px;

  &__help-text {
    padding: 12px 24px 12px 16px;
    gap: 6px;
    background: #f2f8ff;
    border-radius: 8px;
    border: none;

    ul {
      list-style: none;
    }

    ul li::before {
      content: '\2022';
      color: #007aff;
      font-weight: bold;
      display: inline-block;
      width: 1em;
      margin-left: -1em;
    }
  }

  &__action {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: center;
    gap: 24px;
  }

  &__action-input {
    width: 375px;
  }

  &__action-switch {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    white-space: nowrap;
    gap: 4px;
    font-size: 16px;
    line-height: 20px;
    letter-spacing: -0.02em;
    color: #434657;
  }
  &__modal .ant-modal-content {
    background: #ffffff;
    box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.08), 0px 8px 8px rgba(0, 0, 0, 0.16);
    border-radius: 16px;
    overflow: hidden;
  }

  &__modal .ant-modal-body {
    padding: 0;
  }
  &__modal .ant-modal-content {
    background: #ffffff;
    box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.08), 0px 8px 8px rgba(0, 0, 0, 0.16);
    border-radius: 16px;
    overflow: hidden;
  }

  &__modal .ant-modal-body {
    padding: 0;
  }
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
