<template>
  <div class="restricted-contact">
    <a-row type="flex" :gutter="30" class="restricted-contact__row">
      <a-col :xl="7" :lg="10" :sm="12" :xs="24">
        <label class="restricted-contact__label">{{ $t('USERS.DETAIL_USER.ADD_CONTACT') }}</label>
        <a-auto-complete
          class="restricted-contact__autocomplete"
          :placeholder="$t('USERS.MANAGE_USERS.EMAIL')"
          v-model:value="search"
          @search="searchUsersDebounce()"
          @select="onSelect"
        >
          <template #dataSource>
            <a-select-option v-for="user in autoCompleteResults" :key="user.uuid" :value="user.mail">
              <div>
                <UserOutlined class="restricted-contact-autocomplete-user-icon"/>
                <!-- eslint-disable-next-line vue/no-parsing-error -->
                <span class="restricted-contact-autocomplete-user-info">
                  <span>{{ getFullName(user) }}</span>
                  <span>&nbsp;</span>
                  <span>&lt;{{user.mail}}&gt;</span>
                </span>
              </div>
            </a-select-option>
          </template>
        </a-auto-complete>
        <div class="restricted-contact__container">
          <div class="restricted-contact__title">{{ $t('USERS.DETAIL_USER.RESTRICTED_LIST') }}</div>
          <div class="restricted-contact__list">
            <a-tooltip v-for="contact in restrictedContacts" :key="contact.uuid"
              :title="`${getFullName(contact)} <${contact.mail}>`"
            >
              <a-tag class="restricted-contact__tag" closable @close="onRemove(contact)">
                {{ getFullName(contact) }}
              </a-tag>
            </a-tooltip>
          </div>
        </div>
        <a-button class="restricted-contact__save" @click="onSave()">{{ $t('GENERAL.SAVE') }}</a-button>
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import UserAPIClient from '@/modules/user/services/UserAPIClient';
import User from '@/modules/user/type/User';
import RestrictedContact from '@/modules/user/type/RestrictedContact';
import { message } from 'ant-design-vue';
import { UserOutlined } from '@ant-design/icons-vue';

export default defineComponent({
  name: 'RestrictedContacts',
  components: {
    UserOutlined
  },
  async setup () {
    const { t } = useI18n();
    const search = ref('');
    const autoCompleteResults = ref([] as User[]);
    const restrictedContacts = ref([] as RestrictedContact[]);
    const id = useRoute().params.id as string;
    let newRestrictedContacts = [] as RestrictedContact[];
    let removedRestrictedContacts = [] as RestrictedContact[];
    let _debounce: number | undefined;
    let loading = false;

    function transformDto (contact: User) {
      return {
        uuid: contact.uuid,
        firstName: contact.firstName,
        lastName: contact.lastName,
        mail: contact.mail,
        domain: contact.domain
      };
    }

    async function fetchRestrictedContacts () {
      try {
        restrictedContacts.value = await UserAPIClient.listRestrictedContacts(id);
      } catch (error) {
        message.error(error.message || t('ERRORS.COMMON_MESSAGE'));
      }
    }

    async function searchUsers () {
      try {
        if (!search.value) {
          autoCompleteResults.value = [];
          return;
        }

        const { data } = await UserAPIClient.listUsers({
          mail: search.value,
          sortOrder: 'ASC',
          sortField: 'mail',
          type: 'INTERNAL'
        });

        autoCompleteResults.value = data.filter(user => user.uuid !== id);
      } catch (error) {
        message.error(error.message || t('ERRORS.COMMON_MESSAGE'));
      }
    }

    async function searchUsersDebounce () {
      if (_debounce) {
        clearTimeout(_debounce);
      }

      _debounce = setTimeout(() => {
        searchUsers();
      }, 500);
    }

    async function onSelect (value: string) {
      if (restrictedContacts.value.find(contact => contact.mail === value)) {
        message.error(t('ERRORS.CONTACT_ALREADY_EXISTS'));
        return;
      }

      const selectedContact = autoCompleteResults.value.find(contact => contact.mail === value);

      if (selectedContact) {
        newRestrictedContacts.unshift(transformDto(selectedContact));
        restrictedContacts.value.unshift(transformDto(selectedContact));
      }

      search.value = '';
      autoCompleteResults.value = [];
    }

    async function onRemove (contact: User) {
      restrictedContacts.value = restrictedContacts.value.filter(restrictedContact => restrictedContact.uuid !== contact.uuid);

      if (newRestrictedContacts.find(newContact => newContact.uuid === contact.uuid)) {
        newRestrictedContacts = newRestrictedContacts.filter(newContact => newContact.uuid !== contact.uuid);
      } else {
        removedRestrictedContacts.unshift(transformDto(contact));
      }
    }

    async function onSave () {
      try {
        if (loading) {
          return;
        }

        loading = true;
        message.loading(t('MESSAGES.ACTION_IN_PROGRESS'));
        const createRestrictedContactPromises = newRestrictedContacts.map((contact) => UserAPIClient.createRestrictedContact(id, contact));
        const removedRestrictedContactPromises = removedRestrictedContacts.map((contact) => UserAPIClient.removeRestrictedContact(id, contact.uuid));

        await Promise.all(createRestrictedContactPromises);
        await Promise.all(removedRestrictedContactPromises);

        newRestrictedContacts = [];
        removedRestrictedContacts = [];
        loading = false;

        message.success(t('MESSAGES.UPDATE_SUCCESS'));
      } catch (error) {
        message.error(error.message || t('ERRORS.COMMON_MESSAGE'));
      }
    }

    function getFullName (user: RestrictedContact) {
      if (!user) {
        return '';
      }
      return `${user.firstName || ''} ${user.lastName || ''}`;
    }

    await fetchRestrictedContacts();

    return {
      search,
      searchUsers,
      searchUsersDebounce,
      autoCompleteResults,
      restrictedContacts,
      getFullName,
      onSelect,
      onRemove,
      onSave
    };
  }
});
</script>

<style lang='less'>
  .restricted-contact {
    &__row {
      justify-content: center;

      .ant-col {
        margin: 10px 0px;
      }
    }

    &__label {
      font-weight: 600;
      display: block;
      margin-bottom: 5px;
    }

    &__autocomplete {
      width: 100%;
    }

    &__save {
      margin-top: 10px;
      background-color: #06B1FF;
      font-weight: 600;
      color: #fff;
      border: 0px;
      box-shadow: none;
      outline: none;

      &:hover, &:focus {
        background-color: #2cbdff;
        color: #fff;
      }
    }

    &__container {
      margin-top: 15px;
    }

    &__title {
      color: #999999;
      font-size: 13px;
      margin-bottom: 8px;
      text-transform: uppercase;
    }

    &__tag {
      background: #FAFAFA;
      border: 1px solid #F0F0F0;
      padding: 10px;
      margin-right: 10px;
      margin-bottom: 10px;
      border-radius: 3px;
    }
  }

  .restricted-contact-autocomplete-user-icon {
    color: #0372B3;
    margin-right: 4px;
  }

  .restricted-contact-autocomplete-user-info {
    font-weight: 600;
  }
</style>
