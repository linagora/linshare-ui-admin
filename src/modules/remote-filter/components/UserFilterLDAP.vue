<template>
  <PageTitle
    :title="$t('NAVIGATOR.LDAP_USER_FILTER')"
    :subtitle="$t(editMode ? 'USER_FILTER.LDAP.PAGE_SUBTITLE_EDIT' : 'USER_FILTER.LDAP.PAGE_SUBTITLE_CREATE')"
    :breadcrumbs="breadcrumbs"
  >
    <template #helperContent>
      <span>{{ $t('USER_FILTER.LDAP.PAGE_HELPER_P1') }}</span>
      <br />
      <span>{{ $t('USER_FILTER.LDAP.PAGE_HELPER_P2') }}</span>
    </template>

    <template #subTitlePostfix>
      <div v-if="editMode && !fetchingData" class="delete-button-container">
        <a-button type="primary" danger @click="confirmDelete">
          {{ $t('GENERAL.DELETE') }}
        </a-button>
      </div>
    </template>
  </PageTitle>

  <div v-if="fetchingData" class="spinner">
    <a-spin />
  </div>

  <a-form
    v-if="!fetchingData"
    ref="formRef"
    :rules="formRules"
    :model="formState"
    :label-col="{ span: 24 }"
    :wrapper-col="{ span: 24 }"
  >
    <a-row>
      <a-col :xl="{ span: 12, offset: 6 }" :sm="{ span: 24 }">
        <div v-if="!editMode" class="model-selection">
          <a-form-item :label="$t('GENERAL.SELECT_MODEL')">
            <a-select v-model:value="models.selected" :options="models.options" @change="onModelChange" />
          </a-form-item>
        </div>

        <a-form-item :label="$t('GENERAL.NAME')" name="name">
          <a-input v-model:value="formState.name" />
        </a-form-item>

        <a-form-item :label="$t('GENERAL.DESCRIPTION')" name="description">
          <a-textarea v-model:value="formState.description" auto-size />
        </a-form-item>

        <div class="section">
          <h2 class="section__title">
            {{ $t('USER_FILTER.LDAP.FORM.AUTHENTICATION_QUERY') }}
          </h2>

          <p class="section__helper">
            {{ $t('USER_FILTER.LDAP.FORM.AUTHENTICATION_QUERY_HELPER') }}
          </p>

          <a-form-item name="authenticationQuery">
            <a-textarea v-model:value="formState.authenticationQuery" auto-size />
          </a-form-item>
        </div>

        <div class="section">
          <h2 class="section__title">
            {{ $t('USER_FILTER.LDAP.FORM.SEARCH_USER_QUERY') }}
          </h2>
          <p class="section__helper">
            {{ $t('USER_FILTER.LDAP.FORM.SEARCH_USER_QUERY_HELPER') }}
          </p>

          <a-form-item :label="$t('USER_FILTER.LDAP.FORM.QUERY')" name="searchUserQuery">
            <a-textarea v-model:value="formState.searchUserQuery" auto-size />
          </a-form-item>

          <a-row :gutter="32">
            <a-col :span="12">
              <a-form-item :label="$t('USER_FILTER.LDAP.FORM.PAGE_SIZE')" name="searchPageSize">
                <a-input v-model:value="formState.searchPageSize" type="number" />
              </a-form-item>
            </a-col>

            <a-col :span="12">
              <a-form-item :label="$t('USER_FILTER.LDAP.FORM.LIMIT')" name="searchSizeLimit">
                <a-input v-model:value="formState.searchSizeLimit" type="number" />
              </a-form-item>
            </a-col>
          </a-row>
        </div>

        <div class="section">
          <h2 class="section__title">
            {{ $t('USER_FILTER.LDAP.FORM.AUTOCOMPLETE_QUERY') }}
          </h2>
          <p class="section__helper">
            {{ $t('USER_FILTER.LDAP.FORM.AUTOCOMPLETE_QUERY_HELPER') }}
          </p>

          <a-form-item
            :label="$t('USER_FILTER.LDAP.FORM.QUERY_ON_ALL_ATTRIBUTES')"
            name="autoCompleteCommandOnAllAttributes"
          >
            <a-textarea v-model:value="formState.autoCompleteCommandOnAllAttributes" auto-size />
          </a-form-item>

          <a-form-item :label="$t('USER_FILTER.LDAP.FORM.QUERY_ON_NAMES')" name="autoCompleteCommandOnFirstAndLastName">
            <a-textarea v-model:value="formState.autoCompleteCommandOnFirstAndLastName" auto-size />
          </a-form-item>

          <a-row :gutter="32">
            <a-col :span="12">
              <a-form-item :label="$t('USER_FILTER.LDAP.FORM.PAGE_SIZE')" name="completionPageSize">
                <a-input v-model:value="formState.completionPageSize" type="number" />
              </a-form-item>
            </a-col>

            <a-col :span="12">
              <a-form-item :label="$t('USER_FILTER.LDAP.FORM.LIMIT')" name="completionSizeLimit">
                <a-input v-model:value="formState.completionSizeLimit" type="number" />
              </a-form-item>
            </a-col>
          </a-row>
        </div>

        <div class="section">
          <h2 class="section__title">
            {{ $t('USER_FILTER.LDAP.FORM.ATTRIBUTES') }}
          </h2>
          <p class="section__helper">
            {{ $t('USER_FILTER.LDAP.FORM.ATTRIBUTES_HELPER') }}
          </p>

          <a-form-item :label="$t('USER_FILTER.LDAP.FORM.UNIQUE_ID')" name="userUidAttribute">
            <a-input v-model:value="formState.userUidAttribute" />
          </a-form-item>

          <a-form-item :label="$t('USER_FILTER.LDAP.FORM.MAIL')" name="userMailAttribute">
            <a-input v-model:value="formState.userMailAttribute" />
          </a-form-item>

          <a-form-item :label="$t('USER_FILTER.LDAP.FORM.FIRSTNAME')" name="userFirstNameAttribute">
            <a-input v-model:value="formState.userFirstNameAttribute" />
          </a-form-item>

          <a-form-item :label="$t('USER_FILTER.LDAP.FORM.LASTNAME')" name="userLastNameAttribute">
            <a-input v-model:value="formState.userLastNameAttribute" />
          </a-form-item>
        </div>

        <div>
          <a-button v-if="editMode" @click="resetForm">
            {{ $t('GENERAL.RESET') }}
          </a-button>

          <a-button v-else>
            <router-link :to="{ name: 'UserFilters' }">
              {{ $t('GENERAL.CANCEL') }}
            </router-link>
          </a-button>

          <a-button type="primary" style="margin-left: 10px" :loading="formSubmitting" @click="onSubmit">
            {{ $t(props.uuid ? 'GENERAL.SAVE' : 'GENERAL.CREATE') }}
          </a-button>
        </div>
      </a-col>
    </a-row>
  </a-form>
</template>

<script lang="ts" setup>
import { computed, reactive, ref, onMounted } from 'vue';
import { message } from 'ant-design-vue';
import { SelectTypes } from 'ant-design-vue/es/select';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import useBreadcrumbs from '@/core/hooks/useBreadcrumbs';
import useNotification from '@/core/hooks/useNotification';
import PageTitle from '@/core/components/PageTitle.vue';
import UserFilter, { USER_FILTER_TYPE } from '../types/UserFilter';
import {
  createUserFilter,
  deleteUserFilter,
  listUserFilters,
  getAssociatedDomains,
  getUserFilter,
  updateUserFilter,
} from '../services/user-filter-api';

interface Props {
  uuid?: string;
  duplicate?: string;
}

interface UserFilterModelOptions {
  list: UserFilter[];
  options: SelectTypes['options'];
  selected: string;
}

const { confirmModal, infoModal } = useNotification();
const { breadcrumbs } = useBreadcrumbs();
const { t } = useI18n();
const { push } = useRouter();

const props = defineProps<Props>();
const editMode = computed(() => props.uuid && !props.duplicate);
const models = reactive<UserFilterModelOptions>({
  selected: '',
  list: [],
  options: [],
});
const userFilter = {};
const fetchingData = ref(false);
const formRef = ref();
const formSubmitting = ref(false);
const formState = reactive<Partial<UserFilter>>({});
const formRules = computed(() => {
  const required = { required: true, message: t('GENERAL.FIELD_REQUIRED'), trigger: 'change' };

  return {
    name: [required],
    authenticationQuery: [required],
    searchUserQuery: [required],
    autoCompleteCommandOnAllAttributes: [required],
    autoCompleteCommandOnFirstAndLastName: [required],
    userMailAttribute: [required],
    userFirstNameAttribute: [required],
    userLastNameAttribute: [required],
    userUidAttribute: [required],
    searchPageSize: [required],
    searchSizeLimit: [required],
    completionPageSize: [required],
    completionSizeLimit: [required],
  };
});

async function prepareData() {
  fetchingData.value = true;

  if (props.uuid) {
    const filter = await getUserFilter(props.uuid);
    Object.assign(userFilter, filter);
    Object.assign(formState, filter, {
      name: props.duplicate ? '' : filter.name,
    });
  }

  if (!editMode.value) {
    const availableModels = await listUserFilters(true);

    Object.assign(models, {
      list: availableModels,
      options: availableModels.map((model) => ({ label: model.name, value: model.uuid })),
    });
  }

  fetchingData.value = false;
}

async function onSubmit() {
  formSubmitting.value = true;

  try {
    await formRef.value.validate();
  } catch (error) {
    formSubmitting.value = false;
    return;
  }

  try {
    if (props.uuid) {
      await updateUserFilter(props.uuid, {
        ...formState,
        type: USER_FILTER_TYPE.LDAP,
      });

      message.success(t('MESSAGES.UPDATE_SUCCESS'));
    } else {
      await createUserFilter({
        ...formState,
        type: USER_FILTER_TYPE.LDAP,
      });

      message.success(t('MESSAGES.CREATE_SUCCESS'));
      push({ name: 'UserFilters' });
    }
  } catch (error) {
    message.error(t(props.uuid ? 'MESSAGES.UPDATE_FAILURE' : 'ERRORS.CREATE_FAILURE'));
  } finally {
    formSubmitting.value = false;
  }
}

function onModelChange(modelUuid: string) {
  const model = models.list.find((model) => model.uuid === modelUuid);

  Object.assign(formState, model, { name: formState.name });
  formRef.value.validate();
}

function resetForm() {
  Object.assign(formState, userFilter);
}

async function confirmDelete(filter: UserFilter) {
  const usedInDomains = !!(await getAssociatedDomains(filter.uuid)).length;

  if (usedInDomains) {
    return infoModal({
      title: t('GENERAL.DELETION'),
      content: t('USER_FILTER.DELETE_ABORT'),
    });
  }

  confirmModal({
    title: t('GENERAL.DELETION'),
    content: t('USER_FILTER.DELETE_CONFIRM'),
    okText: t('GENERAL.DELETE'),
    onOk: () => removeUserFilter(filter),
  });
}

async function removeUserFilter(filter: UserFilter) {
  try {
    await deleteUserFilter(filter.uuid);

    message.success(t('MESSAGES.DELETE_SUCCESS'));
    push({ name: 'UserFilters' });
  } catch (error) {
    message.error(t('MESSAGES.DELETE_FAILURE'));
  }
}

onMounted(prepareData);
</script>

<style lang="less" scoped>
.spinner {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.delete-button-container {
  margin-bottom: 5px;
}

.section {
  border-top: 1px solid @border-color-base;
  padding-top: 10px;
  margin-top: 10px;

  &__helper {
    color: @text-color-secondary;
  }
}

.model-selection {
  border-bottom: 1px solid @border-color-base;
}
</style>
