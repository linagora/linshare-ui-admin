<template>
  <div class="search-form">
    <a-row type="flex" :gutter="30" class="search-form__row">
      <a-col :lg="7" :sm="12" :xs="24">
        <a-input placeholder="First Name" v-model:value="firstName" />
      </a-col>
      <a-col :lg="7" :sm="12" :xs="24">
        <a-input placeholder="Last Name" v-model:value="lastName" />
      </a-col>
      <a-col :lg="7" :sm="12" :xs="24">
        <a-input placeholder="Mail" v-model:value="mail" />
      </a-col>
      <a-col :lg="3" :sm="12" :xs="24" class="xs-horizontal-center">
        <a-button type="primary" htmlType="submit" @click="submitSearch()">Search</a-button>
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'SearchForm',
  setup (_props, { emit }) {
    const firstName = ref('');
    const lastName = ref('');
    const mail = ref('');

    function submitSearch () {
      if (firstName.value || lastName.value || mail.value) {
        emit('search', {
          firstName: firstName.value,
          lastName: lastName.value,
          mail: mail.value
        });
      }
    }

    return {
      firstName,
      lastName,
      mail,
      submitSearch
    };
  }
});
</script>

<style lang='less' scoped>
  .search-form {
    margin-top: 30px;

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
