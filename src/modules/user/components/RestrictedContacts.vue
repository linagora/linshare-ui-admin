<template>
  <a-row>
    <a-col :md="{ span: 8, offset: 8 }" :sm="24" :xs="24">
      <div v-if="pageStatus === StatusValue.LOADING" class="spinner-ctn">
        <a-spin />
      </div>

      <a-result v-else-if="pageStatus === StatusValue.ERROR" :title="t('ERRORS.COMMON_MESSAGE')" status="error">
        <template #extra>
          <a-button type="primary" @click="fetchRestrictedContacts">
            {{ $t('GENERAL.TRY_AGAIN') }}
          </a-button>
        </template>
      </a-result>

      <a-form v-else :label-col="{ span: 24 }" :wrapper-col="{ span: 24 }">
        <a-form-item>
          <a-checkbox v-model:checked="formState.restricted">
            {{ t('USERS.DETAIL_USER.RESTRICTED_GUEST') }}
          </a-checkbox>
        </a-form-item>

        <a-form-item :label="t('USERS.DETAIL_USER.RESTRICTED_CONTACTS')" v-bind="validateInfos.selected">
          <a-select
            v-model:value="formState.selected"
            mode="multiple"
            :disabled="!formState.restricted"
            :options="options"
            :placeholder="$t('USERS.MANAGE_USERS.EMAIL')"
            @search="searchUsersDebounce"
          >
            <template #option="{ value, label }">
              <UserOutlined class="user-icon" />
              <span>
                <span>{{ label }}</span>
                <span>&nbsp;</span>
                <span>&lt;{{ value }}&gt;</span>
              </span>
            </template>

            <template #notFoundContent>
              <div class="not-found-ctn">
                <a-spin v-if="searching" size="small" />

                <span v-else>{{ t('USERS.DETAIL_USER.NO_USER_FOUND') }}</span>
              </div>
            </template>
          </a-select>
        </a-form-item>

        <a-form-item :label="$t('USERS.DETAIL_USER.COMMENT')">
          <a-textarea v-model:value="formState.comment" auto-size />
        </a-form-item>

        <a-button type="primary" :loading="saving" @click="onSave()">
          {{ $t('GENERAL.SAVE') }}
        </a-button>
      </a-form>
    </a-col>
  </a-row>
</template>

<script lang="ts" setup>
import { computed, ref, reactive, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import { useUserStore } from '@/modules/user/store';
import { useDebounceFn } from '@vueuse/core';
import {
  listUsers,
  listRestrictedContacts,
  createRestrictedContact,
  removeRestrictedContact,
} from '@/modules/user/services/user-api';
import User from '@/modules/user/types/User';
import RestrictedContact from '@/modules/user/types/RestrictedContact';
import { message, Form } from 'ant-design-vue';
import { UserOutlined } from '@ant-design/icons-vue';
import { APIError } from '@/core/types/APIError';
import { SORT_ORDER } from '@/core/types/Sort';
import StatusValue from '@/core/types/Status';
import { storeToRefs } from 'pinia';

interface Option {
  label: string;
  value: string;
  data: RestrictedContact | User;
}

interface FormState {
  selected: string[];
  restricted: boolean;
  comment: string;
}
const id = useRoute().params.id as string;
let restrictedContacts: RestrictedContact[] = [];
const { t } = useI18n();
const userStore = useUserStore();
const useForm = Form.useForm;
const pageStatus = ref<StatusValue>(StatusValue.LOADING);
const { user: currentUser } = storeToRefs(userStore);
const options = ref([] as Option[]);
const saving = ref(false);
const searching = ref(false);
const searchUsersDebounce = useDebounceFn(searchUsers, 500);

const formState = reactive<FormState>({
  selected: [],
  restricted: currentUser.value.restricted,
  comment: currentUser.value.comment,
});
const formRules = computed(() => ({
  selected: [
    {
      message: t('USERS.DETAIL_USER.RESTRICTED_CONTACTS_LIST_REQUIRED'),
      trigger: 'change',
      validator: () => {
        if (formState.restricted && formState.selected.length === 0) {
          return Promise.reject(new Error());
        }

        return Promise.resolve();
      },
    },
  ],
}));
const { validate, validateInfos } = useForm(formState, formRules);

async function fetchRestrictedContacts() {
  pageStatus.value = StatusValue.LOADING;

  try {
    restrictedContacts = await listRestrictedContacts(id);
    formState.selected = restrictedContacts.map((contact) => contact.mail);
    options.value = restrictedContacts.map((contact) => ({
      label: getFullName(contact),
      value: contact.mail,
      data: contact,
    }));
    pageStatus.value = StatusValue.SUCCESS;
  } catch (error) {
    pageStatus.value = StatusValue.ERROR;
    message.error((error as APIError).getMessage());
  }
}

async function searchUsers(search: string) {
  searching.value = true;

  try {
    const { data } = await listUsers({
      mail: search,
      sortOrder: SORT_ORDER.ASC,
      sortField: 'mail',
      type: 'INTERNAL',
    });

    options.value = data
      .filter((user) => user.uuid !== id)
      .map((user) => ({
        label: getFullName(user),
        value: user.mail,
        data: transform(user),
      }));
  } catch (error) {
    if (error instanceof APIError) {
      return message.error(error.getMessage());
    }

    console.warn(error);
  } finally {
    searching.value = false;
  }
}

async function onSave() {
  try {
    await validate();
  } catch {
    return;
  }

  try {
    saving.value = true;

    await userStore.updateUser({
      ...currentUser,
      comment: formState.comment,
      restricted: formState.restricted,
    });
    await updateRestrictedContacts();

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

async function updateRestrictedContacts() {
  if (!formState.restricted) {
    return;
  }

  const contacts = formState.selected
    .map((mail) => options.value.find((option) => option.value === mail)?.data)
    .filter(Boolean);

  const createRestrictedContactPromises = contacts
    .filter((contact) => !restrictedContacts.some((existing) => existing.mail === contact?.mail))
    .map(
      (contact) =>
        contact &&
        createRestrictedContact(id, contact).then((created) => {
          restrictedContacts.push(created);
        })
    );

  const removedRestrictedContactPromises = restrictedContacts
    .filter((existing) => !contacts.some((contact) => contact?.mail === existing.mail))
    .map((contact) =>
      removeRestrictedContact(id, contact.uuid).then((deleted) => {
        restrictedContacts = restrictedContacts.filter((contact) => deleted.uuid !== contact.uuid);
      })
    );

  return await Promise.all([...createRestrictedContactPromises, ...removedRestrictedContactPromises]);
}

function getFullName(user: RestrictedContact) {
  return `${user.firstName || ''} ${user.lastName || ''}`;
}

function transform(user: User): RestrictedContact {
  return {
    uuid: '',
    firstName: user.firstName,
    lastName: user.lastName,
    mail: user.mail,
    domain: user.domain,
  };
}

onMounted(fetchRestrictedContacts);
</script>

<style lang="less" scoped>
.spinner-ctn {
  display: flex;
  height: 100%;
  width: 100%;
  justify-content: center;
  align-items: center;
}
.user-icon {
  color: @primary-color;
  margin-right: 4px;
}

.not-found-ctn {
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
