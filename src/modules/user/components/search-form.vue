<template>
  <div class="search-form">
    <a-row type="flex" :gutter="30" class="search-form__row">
      <a-col :lg="7" :sm="12" :xs="24">
        <a-input v-model:value="firstName" :placeholder="$t('USERS.MANAGE_USERS.FIRST_NAME')" />
      </a-col>
      <a-col :lg="7" :sm="12" :xs="24">
        <a-input v-model:value="lastName" :placeholder="$t('USERS.MANAGE_USERS.LAST_NAME')" />
      </a-col>
      <a-col :lg="7" :sm="12" :xs="24">
        <a-input v-model:value="mail" :placeholder="$t('USERS.MANAGE_USERS.EMAIL')" />
      </a-col>
      <a-col :lg="3" :sm="12" :xs="24" class="xs-horizontal-center">
        <a-button type="primary" html-type="submit" @click="submitSearch()">
          {{ $t('USERS.MANAGE_USERS.SEARCH') }}
        </a-button>
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'SearchForm',
  emits: ['search'],
  setup(_props, { emit }) {
    const firstName = ref('');
    const lastName = ref('');
    const mail = ref('');

    function submitSearch() {
      if (firstName.value || lastName.value || mail.value) {
        emit('search', {
          firstName: firstName.value,
          lastName: lastName.value,
          mail: mail.value,
        });
      }
    }

    return {
      firstName,
      lastName,
      mail,
      submitSearch,
    };
  },
});
</script>

<style lang="less" scoped>
.search-form {
  &__row {
    .ant-col {
      margin: 10px 0px;
    }

    .xs-horizontal-center {
      @media (max-width: 575px) {
        text-align: center;
      }
    }
  }
}
</style>
