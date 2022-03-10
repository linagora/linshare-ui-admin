<template>
  <div class="list-item">
    <a-list-item @click="goToUser">
      <template #actions>
        <span>
          {{ $t('GENERAL.CREATE_TIME_RELATIVE', { time: $d(data.creationDate) }) }}
        </span>
        <span>
          {{ $t('GENERAL.UPDATE_TIME_RELATIVE', { time: relativeModificationDate }) }}
        </span>
      </template>
      <a-list-item-meta :description="data.mail">
        <template #title>
          <div>
            <span class="list-item__name">{{ displayInfo }}</span>
            <span class="list-item__domain">{{ data.domain && data.domain.name }}</span>
          </div>
        </template>
        <template #avatar>
          <a-avatar shape="circle" :size="46" class="list-item__profile-avatar">
            <span>{{ displayInfo.charAt(0) }}</span>
          </a-avatar>
        </template>
      </a-list-item-meta>
      <a-tag color="blue">
        {{ $t(`USERS.DETAIL_USER.TYPE_${data.accountType}`) }}
      </a-tag>
      <a-tag color="purple">
        {{ $t(`USERS.DETAIL_USER.ROLE_${data.role}`) }}
      </a-tag>
    </a-list-item>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import User from '@/modules/user/types/User';
import useRelativeTime from '@/core/hooks/useRelativeTime';

interface Props {
  data: User;
}

const props = defineProps<Props>();
const { push } = useRouter();
const displayInfo = computed(() =>
  !props.data.firstName && !props.data.lastName
    ? props.data.mail
    : `${props.data.firstName} ${props.data.lastName}`.trim()
);
const relativeModificationDate = props.data.modificationDate ? useRelativeTime(props.data.modificationDate) : 'N/A';

function goToUser() {
  push({ name: 'UserDetail', params: { id: props.data.uuid } });
}
</script>

<style lang="less" scoped>
.list-item {
  cursor: pointer;
  border-bottom: 1px solid @border-color-base;
  background: @component-background;

  &__name {
    font-size: 16px;
    font-weight: 600;
  }

  &__domain {
    font-size: 15px;
    font-weight: 600;
    color: @primary-color;
    margin-left: 7px;
  }

  &__account-type {
    border: 0px;
    background: @primary-1;
    border-radius: 3px;
    color: @primary-color;
    padding: 7px;
  }

  &__profile-avatar {
    background-color: @primary-color;
    color: @component-background;
  }
}
</style>
