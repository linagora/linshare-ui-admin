<template>
  <div class="list-item">
    <a-list-item @click="goToUser">
      <template #actions>
        <a-tag class="list-item__account-type">{{data.accountType}}</a-tag>
      </template>
      <a-list-item-meta
        :description="data.mail"
      >
        <template #title>
          <div>
            <span class="list-item__name">{{ displayInfo }}</span>
            <span class="list-item__domain">{{ data.domain && data.domain.label }}</span>
          </div>
        </template>
        <template #avatar>
          <a-avatar shape="circle" :size="46" class="list-item__profile-avatar">
            <span>{{ firstLetter }}</span>
          </a-avatar>
        </template>
      </a-list-item-meta>
    </a-list-item>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import router from '@/core/router';
import User from '@/modules/user/type/User';
import useUser from '@/modules/user/hooks/useUser';

export default defineComponent({
  name: 'DesktopListItem',
  props: {
    data: {
      type: Object as PropType<User>,
      default: () => ({})
    }
  },
  setup (props) {
    const { firstLetter, displayInfo } = useUser(props.data);

    function goToUser () {
      router.push({ name: 'UserDetail', params: { id: props.data.uuid } });
    }

    return {
      firstLetter,
      displayInfo,
      goToUser
    };
  }
});
</script>

<style lang='less' scoped>
  .list-item {
    cursor: pointer;
    border-bottom: 1px solid #EEE;
    background: #FFF;

    &__name {
      font-size: 16px;
      font-weight: 600;
    }

    &__domain {
      font-size: 15px;
      font-weight: 600;
      color: #0372B3;
      margin-left: 7px;
    }

    &__account-type {
      border: 0px;
      background: #EDF9FF;
      border-radius: 3px;
      color: #0372B3;
      padding: 7px;
    }

    &__profile-avatar {
      background-color: #0372B3;
      color: #FFF;
    }
  }
</style>
