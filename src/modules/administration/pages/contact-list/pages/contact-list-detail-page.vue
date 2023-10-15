<template>
  <div class="contact-list-detail-page">
    <div class="contact-list-detail-page__title">
      <contact-list-detail-header
        :editable="allowEdit"
        :editing="editing"
        @edit-toggle="onToggleEditState"
      ></contact-list-detail-header>
    </div>
    <div class="contact-list-detail-page__body">
      <div class="contact-list-detail-page__body-summary">
        <div class="contact-list-detail-page__body-summary-config">
          <contact-list-detail-card
            :editable="allowEdit"
            :editing="editing"
            @refresh="onFetchingData"
          ></contact-list-detail-card>
        </div>
        <div class="contact-list-detail-page__body-summary-rule">
          <contact-list-email-table
            :editable="allowEdit"
            :editing="editing"
            @refresh="onFetchingData"
          ></contact-list-email-table>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import ContactListDetailHeader from '@/modules/administration/pages/contact-list/components/detail-page/contact-list-detail-header.vue';
import ContactListDetailCard from '@/modules/administration/pages/contact-list/components/detail-page/contact-list-detail-card.vue';
import ContactListEmailTable from '@/modules/administration/pages/contact-list/components/detail-page/contact-list-email-table.vue';
import { computed, onMounted, ref } from 'vue';
import useContactList from '../hooks/useContactList';
import { storeToRefs } from 'pinia';
import { useAuthStore } from '@/modules/auth/store';
import { ACCOUNT_ROLE } from '@/modules/user/types/User';
import { useRoute } from 'vue-router';

// composables
const route = useRoute();
const { activeContactList, handleGetContactListDetail } = useContactList();
const { loggedUserRole } = storeToRefs(useAuthStore());

// data
const editing = ref(false);

//computed

const isSuperAdmin = computed(() => {
  return loggedUserRole.value === ACCOUNT_ROLE.SUPERADMIN;
});
const allowEdit = computed(() => {
  return isSuperAdmin.value;
});
// methods

function onToggleEditState() {
  editing.value = !editing.value;
}

function onFetchingData() {
  const id = route.params?.id?.toString();
  handleGetContactListDetail(id ?? activeContactList?.value?.uuid);
}

onMounted(async () => {
  onFetchingData();
});
</script>

<style lang="less">
.contact-list-detail-page {
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

  &__title {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: center;
    gap: 24px;
    width: 100%;
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

  &__body {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
  }

  &__body-summary {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
    gap: 24px;
  }

  &__body-summary-config {
    border-right: 2px solid #fafafa;
    padding-right: 20px;
    width: 35%;
  }

  &__body-summary-rule {
    width: 65%;
  }

  &__body-summary-system {
    width: 50%;
  }

  &__body-table {
    width: 100%;
    margin-top: 20px;
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
