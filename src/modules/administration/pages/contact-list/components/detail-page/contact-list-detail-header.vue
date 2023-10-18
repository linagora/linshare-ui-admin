<template>
  <div class="contact-list-detail-header">
    <div class="contact-list-detail-header__title">
      {{ $t('CONTACT_LIST.CONTACT_LIST') }}
    </div>
    <div class="contact-list-detail-header__action">
      <a-input
        v-model:value="filterText"
        :placeholder="$t('CONTACT_LIST.SEARCH_BY')"
        class="contact-list-detail-header__action-input ls-input"
        allow-clear
      >
        <template #prefix>
          <SearchOutlined />
        </template>
      </a-input>
      <template v-if="!editing">
        <a-button v-if="editable && !editing" class="ls-button ls-cancel">
          <PlusOutlined />
          {{ $t('CONTACT_LIST.ADD_CONTACT') }}
        </a-button>
      </template>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useRouter } from 'vue-router';
import useContactList from '../../hooks/useContactList';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons-vue';

const router = useRouter();

// props & emits
const props = defineProps<{
  editable?: boolean;
  editing?: boolean;
}>();

const { filterText } = useContactList();
</script>
<style lang="less">
.contact-list-detail-header {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
  padding-bottom: 28px;
  width: 100%;
  gap: 16px;

  &__title {
    color: var(--neutral-colors-color-text-title, #1b1d29);
    font-family: Inter;
    font-size: 20px;
    font-style: normal;
    font-weight: 600;
    line-height: 24px;
  }

  &__action {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: 12px;

    .ls-button {
      padding: 0px 20px;
      min-width: 151px;
      height: 44px;
      background: #f3f3f7;
      border-radius: 8px;
      color: #007aff;
    }

    .ls-filled {
      background-color: #007aff;
      color: #f3f3f7;
    }
  }

  &__action-input {
    width: 380px;
  }
  .ls-input {
    height: 44px;
    background: #fff;
    border: 1px solid #e4e5f0;
    border-radius: 10px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
  }
}
</style>
