<template>
  <div class="restricted-contact">
    <a-row
      type="flex"
      :gutter="30"
      class="restricted-contact__row"
    >
      <a-col
        :xl="7"
        :lg="10"
        :sm="12"
        :xs="24"
      >
        <label class="restricted-contact__label">{{ $t('USERS.DETAIL_USER.ADD_CONTACT') }}</label>
        <a-auto-complete
          v-model:value="search"
          class="restricted-contact__autocomplete"
          :placeholder="$t('USERS.MANAGE_USERS.EMAIL')"
          @search="searchUsersDebounce()"
          @select="onSelect"
        >
          <template #options>
            <a-select-option
              v-for="result in autoCompleteResults"
              :key="result.uuid"
              :value="result.mail"
            >
              <div>
                <UserOutlined class="restricted-contact-autocomplete-user-icon" />
                <span class="restricted-contact-autocomplete-user-info">
                  <span>{{ getFullName(result) }}</span>
                  <span>&nbsp;</span>
                  <span>&lt;{{ result.mail }}&gt;</span>
                </span>
              </div>
            </a-select-option>
          </template>
        </a-auto-complete>
        <div class="restricted-contact__container">
          <div class="restricted-contact__title">
            {{ $t('USERS.DETAIL_USER.RESTRICTED_LIST') }}
          </div>
          <div class="restricted-contact__list">
            <a-tooltip
              v-for="contact in restrictedContacts"
              :key="contact.uuid"
              :title="`${getFullName(contact)} <${contact.mail}>`"
            >
              <a-tag
                class="restricted-contact__tag"
                closable
                @close="onRemove(contact)"
              >
                {{ getFullName(contact) }}
              </a-tag>
            </a-tooltip>
          </div>
        </div>
        <div class="restricted-contact__container">
          <div class="restricted-contact__title">
            {{ $t('USERS.DETAIL_USER.COMMENT') }}
          </div>
          <div class="restricted-contact__list">
            <a-textarea
              v-model:value="user.comment"
              auto-size
            />
          </div>
        </div>

        <div class="restricted-contact__save">
          <a-button
            type="primary"
            :loading="saving"
            @click="onSave()"
          >
            {{ $t('GENERAL.SAVE') }}
          </a-button>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import {
  listUsers,
  listRestrictedContacts,
  createRestrictedContact,
  removeRestrictedContact
} from '@/modules/user/services/user-api';
import User from '@/modules/user/types/User';
import RestrictedContact from '@/modules/user/types/RestrictedContact';
import { message } from 'ant-design-vue';
import { UserOutlined } from '@ant-design/icons-vue';
import { APIError } from '@/core/types/APIError';

export default defineComponent({
  name: 'RestrictedContacts',
  components: {
    UserOutlined
  },
  async setup () {
    const { t } = useI18n();
    const search = ref('');
    const store = useStore();
    const autoCompleteResults = ref([] as User[]);
    const restrictedContacts = ref([] as RestrictedContact[]);
    const id = useRoute().params.id as string;
    const user = computed<User>(() => store.getters['User/getUser']);
    const saving = ref(false);
    let newRestrictedContacts = [] as RestrictedContact[];
    let removedRestrictedContacts = [] as RestrictedContact[];
    let _debounce: number | undefined;

    function transformDto (contact: RestrictedContact) {
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
        restrictedContacts.value = await listRestrictedContacts(id);
      } catch (error) {
        message.error((error as APIError).getMessage());
      }
    }

    async function searchUsers () {
      try {
        if (!search.value) {
          autoCompleteResults.value = [];
          return;
        }

        const { data } = await listUsers({
          mail: search.value,
          sortOrder: 'ASC',
          sortField: 'mail',
          type: 'INTERNAL'
        });

        autoCompleteResults.value = data.filter(user => user.uuid !== id);
      } catch (error) {
        if (error instanceof APIError) {
          message.error(error.getMessage());
        } else {
          console.error(error);
        }
      }
    }

    async function searchUsersDebounce () {
      if (_debounce) {
        clearTimeout(_debounce);
      }

      _debounce = window.setTimeout(searchUsers, 500);
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

    async function onRemove (contact: RestrictedContact) {
      restrictedContacts.value = restrictedContacts.value.filter(restrictedContact => restrictedContact.uuid !== contact.uuid);

      if (newRestrictedContacts.find(newContact => newContact.uuid === contact.uuid)) {
        newRestrictedContacts = newRestrictedContacts.filter(newContact => newContact.uuid !== contact.uuid);
      } else {
        removedRestrictedContacts.unshift(transformDto(contact));
      }
    }

    async function onSave () {
      if (saving.value) {
        return;
      }

      try {
        saving.value = true;
        const createRestrictedContactPromises = newRestrictedContacts.map((contact) => createRestrictedContact(id, contact));
        const removedRestrictedContactPromises = removedRestrictedContacts.map((contact) => removeRestrictedContact(id, contact.uuid));

        await Promise.all(createRestrictedContactPromises);
        await Promise.all(removedRestrictedContactPromises);
        await store.dispatch('User/updateUser', { ...user.value });

        newRestrictedContacts = [];
        removedRestrictedContacts = [];
        saving.value = false;

        message.success(t('MESSAGES.UPDATE_SUCCESS'));
      } catch (error) {
        if (error instanceof APIError) {
          message.error(error.getMessage());
        } else {
          console.error(error);
        }
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
      autoCompleteResults,
      getFullName,
      onSelect,
      onRemove,
      onSave,
      saving,
      search,
      searchUsers,
      searchUsersDebounce,
      restrictedContacts,
      user
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
    }

    &__container {
      margin-top: 15px;
    }

    &__title {
      color: @text-color-secondary;
      font-size: 13px;
      margin-bottom: 8px;
      text-transform: uppercase;
    }

    &__tag {
      background: @background-color-base;
      border: 1px solid @border-color-base;
      padding: 10px;
      margin-right: 10px;
      margin-bottom: 10px;
      border-radius: 3px;

      .anticon-close {
        margin-left: 5px;
      }
    }
  }

  .restricted-contact-autocomplete-user-icon {
    color: @primary-color;
    margin-right: 4px;
  }

  .restricted-contact-autocomplete-user-info {
    font-weight: 600;
  }
</style>
