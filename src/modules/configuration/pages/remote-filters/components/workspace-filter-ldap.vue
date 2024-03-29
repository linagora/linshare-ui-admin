<template>
  <PageTitle
    :title="$t('NAVIGATOR.LDAP_WORKSPACE_FILTER')"
    :subtitle="$t(editMode ? 'WORKSPACE_FILTER.LDAP.PAGE_SUBTITLE_EDIT' : 'WORKSPACE_FILTER.LDAP.PAGE_SUBTITLE_CREATE')"
  >
    <template #helperContent>
      <span>{{ $t('WORKSPACE_FILTER.LDAP.PAGE_HELPER_P1') }}</span>
      <br />
      <span>{{ $t('WORKSPACE_FILTER.LDAP.PAGE_HELPER_P2') }}</span>
      <ul>
        <li>{{ $t('WORKSPACE_FILTER.LDAP.PAGE_HELPER_P3') }}</li>
        <li>{{ $t('WORKSPACE_FILTER.LDAP.PAGE_HELPER_P4') }}</li>
      </ul>
    </template>

    <template #subTitlePostfix>
      <div v-if="editMode && !fetchingData" class="delete-button-container">
        <a-button type="primary" danger @click="confirmDelete">
          {{ $t('GENERAL.DELETE') }}
        </a-button>
      </div>
    </template>
  </PageTitle>
  <router-link :to="{ name: 'WorkspaceFilters' }">
    <ArrowLeftIcon></ArrowLeftIcon>
  </router-link>
  <div v-if="fetchingData" class="spinner">
    <a-spin />
  </div>

  <a-form v-if="!fetchingData" :label-col="{ span: 24 }" :wrapper-col="{ span: 24 }">
    <a-row>
      <a-col :xl="{ span: 12, offset: 6 }" :sm="{ span: 24 }">
        <div v-if="!editMode" class="model-selection">
          <a-form-item :label="$t('GENERAL.SELECT_MODEL')">
            <a-select v-model:value="models.selected" :options="models.options" @change="onModelChange" />
          </a-form-item>
        </div>

        <a-form-item :label="$t('GENERAL.NAME')" v-bind="validateInfos.name">
          <a-input v-model:value="formState.name" />
        </a-form-item>

        <a-form-item :label="$t('GENERAL.DESCRIPTION')" v-bind="validateInfos.description">
          <a-textarea v-model:value="formState.description" auto-size />
        </a-form-item>

        <div class="section">
          <h2 class="section__title">
            {{ $t('WORKSPACE_FILTER.LDAP.FORM.WORK_SPACE_SEARCH') }}
          </h2>

          <p class="section__helper">
            {{ $t('WORKSPACE_FILTER.LDAP.FORM.WORK_SPACE_SEARCH_HELPER') }}
          </p>

          <a-form-item
            :label="$t('WORKSPACE_FILTER.LDAP.FORM.QUERY_FOR_ALL')"
            v-bind="validateInfos.searchAllGroupsQuery"
          >
            <a-textarea v-model:value="formState.searchAllGroupsQuery" auto-size />
          </a-form-item>

          <a-form-item :label="$t('WORKSPACE_FILTER.LDAP.FORM.QUERY_FOR_ONE')" v-bind="validateInfos.searchGroupQuery">
            <a-textarea v-model:value="formState.searchGroupQuery" auto-size />
          </a-form-item>

          <a-row :gutter="32">
            <a-col :span="12">
              <a-form-item
                :label="$t('WORKSPACE_FILTER.LDAP.FORM.PREFIX')"
                :help="$t('WORKSPACE_FILTER.LDAP.FORM.PREFIX_HELPER')"
                v-bind="validateInfos.groupPrefixToRemove"
              >
                <a-input v-model:value="formState.groupPrefixToRemove" auto-size />
              </a-form-item>
            </a-col>

            <a-col :span="12">
              <a-form-item
                :label="$t('WORKSPACE_FILTER.LDAP.FORM.SEARCH_PAGE_SIZE')"
                v-bind="validateInfos.searchPageSize"
              >
                <a-input v-model:value="formState.searchPageSize" type="number" />
              </a-form-item>
            </a-col>
          </a-row>
        </div>

        <div class="section">
          <h2 class="section__title">
            {{ $t('WORKSPACE_FILTER.LDAP.FORM.ATTRIBUTES') }}
          </h2>

          <a-form-item
            :label="$t('WORKSPACE_FILTER.LDAP.FORM.MEMBER_EMAIL')"
            v-bind="validateInfos.memberMailAttribute"
          >
            <a-input v-model:value="formState.memberMailAttribute" />
          </a-form-item>

          <a-form-item
            :label="$t('WORKSPACE_FILTER.LDAP.FORM.MEMBER_FIRSTNAME')"
            v-bind="validateInfos.memberFirstNameAttribute"
          >
            <a-input v-model:value="formState.memberFirstNameAttribute" />
          </a-form-item>

          <a-form-item
            :label="$t('WORKSPACE_FILTER.LDAP.FORM.MEMBER_LASTNAME')"
            v-bind="validateInfos.memberLastNameAttribute"
          >
            <a-input v-model:value="formState.memberLastNameAttribute" />
          </a-form-item>

          <a-form-item
            :label="$t('WORKSPACE_FILTER.LDAP.FORM.WORK_SPACE_NAME')"
            v-bind="validateInfos.groupNameAttribute"
          >
            <a-input v-model:value="formState.groupNameAttribute" />
          </a-form-item>

          <a-form-item
            :label="$t('WORKSPACE_FILTER.LDAP.FORM.WORK_SPACE_MEMBER')"
            v-bind="validateInfos.groupMemberAttribute"
          >
            <a-input v-model:value="formState.groupMemberAttribute" />
          </a-form-item>
        </div>

        <div>
          <a-button v-if="editMode" @click="Object.assign(formState, groupFilter)">
            {{ $t('GENERAL.RESET') }}
          </a-button>

          <a-button v-else>
            <router-link :to="{ name: 'WorkspaceFilters' }">
              {{ $t('GENERAL.CANCEL') }}
            </router-link>
          </a-button>

          <a-button type="primary" style="margin-left: 10px" :loading="formSubmitting" @click="submit">
            {{ $t($route.params.duplicate ? 'GENERAL.CREATE' : 'GENERAL.SAVE') }}
          </a-button>
        </div>
      </a-col>
    </a-row>
  </a-form>
</template>

<script lang="ts" setup>
import { computed, reactive, ref, onMounted } from 'vue';
import { message, Form } from 'ant-design-vue';
import PageTitle from '@/core/components/page-title.vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import useNotification from '@/core/hooks/useNotification';
import { APIError } from '@/core/types/APIError';
import { EMPTY_FILTER, LDAPWorkspaceFilter } from '../types/WorkspaceFilters';
import { SelectTypes } from 'ant-design-vue/es/select';
import { useRoute } from 'vue-router';
import ArrowLeftIcon from '@/core/components/icons/arrow-left-icon.vue';

import {
  createWorkspaceFilter,
  deleteWorkspaceFilter,
  getWorkspaceFilter,
  getWorkspaceFilterAssociatedDomains,
  listWorkspaceFilters,
  updateWorkspaceFilter,
} from '../services/workspace-filter-api';

interface GroupFilterModelOptions {
  list: LDAPWorkspaceFilter[];
  options: SelectTypes['options'];
  selected: string;
}

const useForm = Form.useForm;
const { confirmModal, infoModal } = useNotification();
const { t } = useI18n();
const route = useRoute();
const { push } = useRouter();

const editMode = computed(() => !route.params.duplicate);
const models = reactive<GroupFilterModelOptions>({
  selected: '',
  list: [],
  options: [],
});
const groupFilter: LDAPWorkspaceFilter | Record<never, string> = {};
const fetchingData = ref(false);
const formSubmitting = ref(false);
const formState = reactive<LDAPWorkspaceFilter>({ ...EMPTY_FILTER });

const formRules = reactive({
  name: [{ required: true, message: t('GENERAL.FIELD_REQUIRED'), trigger: 'change' }],
  groupMemberAttribute: [{ required: true, message: t('GENERAL.FIELD_REQUIRED'), trigger: 'change' }],
  groupPrefixToRemove: [{ required: true, message: t('GENERAL.FIELD_REQUIRED'), trigger: 'change' }],
  memberFirstNameAttribute: [{ required: true, message: t('GENERAL.FIELD_REQUIRED'), trigger: 'change' }],
  memberLastNameAttribute: [{ required: true, message: t('GENERAL.FIELD_REQUIRED'), trigger: 'change' }],
  memberMailAttribute: [{ required: true, message: t('GENERAL.FIELD_REQUIRED'), trigger: 'change' }],
  groupNameAttribute: [{ required: true, message: t('GENERAL.FIELD_REQUIRED'), trigger: 'change' }],
  searchAllGroupsQuery: [{ required: true, message: t('GENERAL.FIELD_REQUIRED'), trigger: 'change' }],
  searchGroupQuery: [{ required: true, message: t('GENERAL.FIELD_REQUIRED'), trigger: 'change' }],
  searchPageSize: [{ required: true, message: t('GENERAL.FIELD_REQUIRED') }],
});
const { validate, validateInfos } = useForm(formState, formRules);

async function prepareData() {
  fetchingData.value = true;

  try {
    if (route.params.filterUuid) {
      const filter = await getWorkspaceFilter(route.params.filterUuid);
      Object.assign(groupFilter, filter);
      Object.assign(formState, filter, {
        name: route.params.duplicate ? '' : filter.name,
      });
    }

    if (!editMode.value) {
      const availableModels = await listWorkspaceFilters(true);

      Object.assign(models, {
        list: availableModels,
        options: availableModels.map((model) => ({ label: model.name, value: model.uuid })),
      });
    }
  } catch (error) {
    if (error instanceof APIError) {
      message.error(error.getMessage());
    } else {
      console.error(error);
    }

    push({ name: 'WorkspaceFilters' });
  } finally {
    fetchingData.value = false;
  }
}

async function submit() {
  formSubmitting.value = true;

  try {
    await validate();
  } catch (error) {
    formSubmitting.value = false;
    return;
  }

  try {
    if (editMode.value) {
      await updateWorkspaceFilter({ ...formState });

      message.success(t('MESSAGES.UPDATE_SUCCESS'));
    } else {
      await createWorkspaceFilter({ ...formState });

      message.success(t('MESSAGES.CREATE_SUCCESS'));
      push({ name: 'WorkspaceFilters' });
    }
  } catch (error) {
    if (error instanceof APIError) {
      message.error(error.getMessage());
    } else {
      console.error(error);
    }
  } finally {
    formSubmitting.value = false;
  }
}

function onModelChange(modelUuid: string) {
  const model = models.list.find((model) => model.uuid === modelUuid);

  Object.assign(formState, model, { name: formState.name });
  validate();
}

async function confirmDelete() {
  if (route.params.duplicate) return;

  let usedInDomains = false;

  try {
    usedInDomains = (await getWorkspaceFilterAssociatedDomains(route.params.filterUuid)).length > 0;
  } catch (error) {
    message.error((error as APIError).getMessage());

    return;
  }

  if (usedInDomains) {
    return infoModal({
      title: t('GENERAL.DELETION'),
      content: t('WORKSPACE_FILTER.DELETE_ABORT'),
    });
  }

  confirmModal({
    title: t('GENERAL.DELETION'),
    content: t('WORKSPACE_FILTER.DELETE_CONFIRM'),
    okText: t('GENERAL.DELETE'),
    onOk: () =>
      route.params.filterUuid &&
      deleteWorkspaceFilter(route.params.filterUuid)
        .then(() => {
          message.success(t('MESSAGES.DELETE_SUCCESS'));
          push({ name: 'WorkspaceFilters' });
        })
        .catch((error) => {
          message.error(t('MESSAGES.DELETE_FAILURE'));
          console.error(error);
        }),
  });
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
