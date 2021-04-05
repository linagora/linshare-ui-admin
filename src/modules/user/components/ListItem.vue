<template>
  <div class="list-item">
    <a-card @click="goToUser">
      <a-row :gutter="20">
        <a-col :xs="8" :sm="6">
          <div class="info-block">
            <div class="info-block__name">{{ data.firstName }} {{ data.lastName}}</div>
          </div>
        </a-col>
        <a-col :xs="16" :sm="10">
          <div class="info-block">
            <div class="info-block__title">{{ $t('USERS.MANAGE_USERS.EMAIL') }}</div>
            <div class="info-block__value">{{ data.mail }}</div>
          </div>
          <div class="info-block visible-xs">
            <div class="info-block__title">{{ $t('USERS.MANAGE_USERS.DOMAIN') }}</div>
            <div class="info-block__value">{{ data.domain && data.domain.label }}</div>
          </div>
          <div class="info-block">
            <div class="info-block__title">{{ $t('USERS.MANAGE_USERS.ROLE') }}</div>
            <div class="info-block__value"> {{ data.role }}</div>
          </div>
          <div class="info-block">
            <div class="info-block__title">{{ $t('USERS.MANAGE_USERS.ACCOUNT_TYPE') }}</div>
            <div class="info-block__value"> {{ data.accountType }}</div>
          </div>
        </a-col>
        <a-col :xs="0" :sm="8">
          <div class="info-block">
            <div class="info-block__title">{{ $t('USERS.MANAGE_USERS.DOMAIN') }}</div>
            <div class="info-block__value">{{ data.domain }}</div>
          </div>
        </a-col>
      </a-row>
    </a-card>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import router from '@/core/router';

export default defineComponent({
  name: 'ListItem',
  props: {
    data: {
      type: Object,
      default: () => ({})
    }
  },
  setup (props) {
    function goToUser () {
      router.push({ name: 'UserDetail', params: { id: props.data.uuid } });
    }

    return { goToUser };
  }
});
</script>

<style lang='less' scoped>
  .list-item {
    cursor: pointer;
    margin: 15px 0px;

    .info-block {
      padding: 5px;
      margin-bottom: 20px;

      &__name {
        font-size: 14px;
        font-weight: 600;
        color: #333;
      }

      &__title {
        color: #999;
      }

      &__value {
        color: #333;
      }
    }

    .visible-xs {
      display: none;
      @media (max-width: 575px) {
        display: block;
      }
    }
  }
</style>
