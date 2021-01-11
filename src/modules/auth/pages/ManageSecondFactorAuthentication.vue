<template>
  <PageTitle
    :title="$t('2FA.TITLE')"
  >
    <template #titlePostfix>
      <span :class="['feature-status', { 'active': secondFA.enabled }]">
        {{ secondFA.enabled ? $t('GENERAL.ENABLED') : $t('GENERAL.DISABLED') }}
      </span>
    </template>
  </PageTitle>

  <KeyCreation v-if="!initiallyEnabled"/>
  <KeyRemoval v-else/>
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
  async setup () {
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
  color: #333333;
  background-color: #FAFAFA;
  border: 1px solid #D9D9D9;

  &.active {
    color: #52C41A;
    background-color: #F6FFED;
    border: 1px solid #B7EB8F;
  }
}

.second-fa-management {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  .helper-text {
    font-size: 16px;
    font-weight: 400;
    color: #333333;
  }

  .instruction {
    margin-top: 30px;

    &__number {
      background-color: #1B7CCA;
      color:#ffffff;
      float: left;
      text-align: center;
      border-radius: 50%;
      height: 20px;
      width: 20px;
      line-height: 20px;
      margin-right: 8px;
    }

    &__text {
      color: #696969;
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

    small {
      margin: 25px 0;
    }
  }

  .button {
    margin-top: 40px;
  }
}
</style>
