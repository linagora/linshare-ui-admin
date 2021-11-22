<template>
  <PageTitle
    :title="$t('2FA.TITLE')"
  >
    <template #titlePostfix>
      <span :class="['feature-status', { 'active': secondFA.enabled }]">
        {{ secondFA && secondFA.enabled ? $t('GENERAL.ENABLED') : $t('GENERAL.DISABLED') }}
      </span>
    </template>
  </PageTitle>

  <KeyCreation v-if="!initiallyEnabled" />
  <KeyRemoval v-else />
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useStore } from 'vuex';
import PageTitle from '@/core/components/PageTitle.vue';
import KeyCreation from '../components/KeyCreation.vue';
import KeyRemoval from '../components/KeyRemoval.vue';

export default defineComponent({
  name: 'ManageSecondFactorAuthentication',
  components: {
    PageTitle,
    KeyCreation,
    KeyRemoval
  },
  setup () {
    const store = useStore();
    const secondFA = computed(() => store.getters['Auth/getSecondFA']);
    const initiallyEnabled = secondFA.value?.enabled;

    return {
      initiallyEnabled,
      secondFA
    };
  }
});
</script>

<style lang='less'>
  .qrcode-ctn {
    position: relative;
    margin: 0 auto;
    text-align: center;

    img {
      position: absolute;
      height: calc(100% / 3);
      width: calc(100% / 3);
      left: calc(100% / 3);
      top: calc(100% / 3);
    }
  }

  span.feature-status {
    font-weight: 500;
    margin-left: 10px;
    padding: 1px 8px;
    border-radius: 2px;
    background-color: @shadow-color-inverse;
    border: 1px solid @shadow-color;

    &.active {
      color: @success-color;
      background-color: @alert-success-bg-color;
      border: 1px solid @alert-success-border-color;
    }
  }

  .second-fa-management {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    margin-top: 10px;

    .helper-text {
      font-size: 16px;
      font-weight: 400;
    }

    .instruction {
      margin-top: 30px;

      &__number {
        background-color: @primary-color;
        color:@text-color-inverse;
        float: left;
        text-align: center;
        border-radius: 50%;
        height: 20px;
        width: 20px;
        line-height: 20px;
        margin-right: 8px;
      }

      &__text {
        color: @text-color-medium;
      }
    }

    .install-links {
      display: flex;
      flex-direction: row;
      justify-content: space-evenly;
      flex-wrap: wrap;
      margin: 30px 0;

      .link {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin: 0 40px;

        a {
          margin-top: 10px;
        }
      }
    }

    .shared-key {
      display: flex;
      align-items: center;
      flex-direction: column;
      color: @text-color-medium;

      small {
        margin: 25px 0;
      }
    }

    .button {
      margin-top: 40px;
    }
  }
</style>
