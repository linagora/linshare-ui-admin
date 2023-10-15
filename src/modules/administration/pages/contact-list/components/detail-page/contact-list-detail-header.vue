<template>
  <div class="contact-list-detail-header">
    <div class="contact-list-detail-header__title">
      <strong>{{ activeContactList.identifier }}</strong>
    </div>
    <div class="contact-list-detail-header__action">
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
import { PlusOutlined } from '@ant-design/icons-vue';

const router = useRouter();

// props & emits
const props = defineProps<{
  editable?: boolean;
  editing?: boolean;
}>();

const { activeContactList } = useContactList();
</script>
<style lang="less">
.contact-list-detail-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  padding-bottom: 28px;
  width: 100%;

  &__title {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;

    strong {
      font-weight: 600;
      font-size: 17px;
      line-height: 24px;
      color: #1b1d29;
    }

    span {
      font-weight: 400;
      font-size: 13px;
      line-height: 16px;
      color: #989cb1;
    }
  }

  &__action {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
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
}
</style>
