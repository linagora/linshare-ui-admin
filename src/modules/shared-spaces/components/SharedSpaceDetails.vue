<template>
  <PageTitle
    :title="$t('NAVIGATOR.SHARED_SPACE_DETAILS')"
    :subtitle="sharedSpace.name"
    :breadcrumbs="breadcrumbs"
  >
    <template #subTitlePostfix>
      <div class="delete-button-container">
        <a-popconfirm
          v-if="loaded"
          :title="$t('USERS.DETAIL_USER.CONFIRM_DELETE')"
          :ok-text="$t('USERS.DETAIL_USER.YES')"
          :cancel-text="$t('USERS.DETAIL_USER.NO')"
          placement="bottom"
        >
          <a-button>
            {{ $t(`SHARED_SPACES.DELETE_${sharedSpace.nodeType}`) }}
          </a-button>
        </a-popconfirm>
      </div>
    </template>
  </PageTitle>

  <div
    v-if="!loaded"
    class="spinner"
  >
    <a-spin />
  </div>

  <a-row
    v-if="loaded"
    :gutter="24"
  >
    <a-col
      :xl="{ span: 8, offset: 5 }"
      :md="{ span: 12 }"
    >
      <a-form
        :label-col="{ span: 24 }"
        :wrapper-col="{ span: 24 }"
      >
        <a-form-item :label="$t('GENERAL.NAME')">
          <a-input v-model:value="formState.name" />
        </a-form-item>

        <a-form-item :label="$t('GENERAL.DESCRIPTION')">
          <a-textarea
            v-model:value="formState.description"
            auto-size
          />
        </a-form-item>

        <a-button
          type="primary"
          :loading="saving"
          @click="update"
        >
          {{ $t('GENERAL.SAVE') }}
        </a-button>
      </a-form>
    </a-col>

    <a-col
      :xl="{ span: 6 }"
      :md="{ span: 12 }"
      :sm="{ span: 24 }"
    >
      <div class="info-block-container">
        <div
          v-if="sharedSpace.author"
          class="info-block"
        >
          <div class="title">
            {{ $t('GENERAL.AUTHOR') }}
          </div>

          <div class="value">
            {{ sharedSpace.author.name }}
          </div>
        </div>

        <div
          v-if="sharedSpace.nodeType"
          class="info-block"
        >
          <div class="title">
            {{ $t('SHARED_SPACES.TOKEN_INPUT.TYPE') }}
          </div>

          <div class="value">
            {{ $t(`SHARED_SPACES.NODE_TYPE.${sharedSpace.nodeType}`) }}
          </div>
        </div>

        <div
          v-if="sharedSpace.parentUuid"
          class="info-block"
        >
          <div class="title">
            {{ $t('SHARED_SPACES.NODE_TYPE.WORK_SPACE') }}
          </div>
          <div class="value">
            <router-link :to="{ name: 'SharedSpaceDetails', params: { id: sharedSpace.parentUuid } }">
              {{ parentSpace.name }}
            </router-link>
          </div>
        </div>

        <div class="info-block">
          <div class="title">
            {{ $t('GENERAL.DOMAIN') }}
          </div>
          <div class="value">
            <router-link
              :to="{ name: 'DomainDetails', params: {
                domain: sharedSpaceDomain.uuid
              }}"
            >
              {{ sharedSpaceDomain.name }}
            </router-link>
          </div>
        </div>

        <div
          v-if="sharedSpace.creationDate"
          class="info-block"
        >
          <div class="title">
            {{ $t('GENERAL.CREATION_DATE') }}
          </div>
          <div class="value">
            {{ $d(sharedSpace.creationDate, 'mediumDate') }}
          </div>
        </div>

        <div
          v-if="sharedSpace.modificationDate"
          class="info-block"
        >
          <div class="title">
            {{ $t('GENERAL.MODIFICATION_DATE') }}
          </div>
          <div class="value">
            {{ $d(sharedSpace.modificationDate, 'mediumDate') }}
          </div>
        </div>
      </div>
    </a-col>
  </a-row>

  <a-tabs v-if="loaded">
    <a-tab-pane
      key="1"
      :tab="$t('SHARED_SPACES.MEMBERS.TAB_TITLE')"
    >
      <SharedSpaceMembersList :shared-space="sharedSpace" />
    </a-tab-pane>
  </a-tabs>
</template>

<script lang='ts' setup>
import { reactive, ref, watchEffect } from 'vue';
import { message } from 'ant-design-vue';
import { useRouter } from 'vue-router';

import PageTitle from '@/core/components/PageTitle.vue';
import SharedSpaceMembersList from './SharedSpaceMembersList.vue';
import useBreadcrumbs from '@/core/hooks/useBreadcrumbs';
import { getSharedSpace, updateSharedSpace } from '../services/shared-space-api';
import { APIError } from '@/core/types/APIError';
import SharedSpace, { EMPTY_SHARED_SPACE } from '../types/SharedSpace';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';
import { EMPTY_DOMAIN_NODE } from '@/modules/domain/types/DomainTreeNode';

interface SharedSpaceForm {
  name: string;
  description: string;
}

const store = useStore();
const { push, currentRoute } = useRouter();
const { t } = useI18n();
const { breadcrumbs } = useBreadcrumbs();
const loaded = ref(false);
const saving = ref(false);
const sharedSpace = reactive<SharedSpace>({ ...EMPTY_SHARED_SPACE });
const parentSpace = reactive<SharedSpace>({ ...EMPTY_SHARED_SPACE });
const sharedSpaceDomain = reactive<SharedSpace>({ ...EMPTY_DOMAIN_NODE });
const formState = reactive<SharedSpaceForm>({
  name: '',
  description: ''
});

async function update () {
  saving.value = true;

  try {
    const data = await updateSharedSpace({
      ...sharedSpace,
      ...formState
    });

    Object.assign(sharedSpace, data);
    message.success(t('MESSAGES.UPDATE_SUCCESS'));
  } catch (error) {
    if (error instanceof APIError) {
      message.error(error.getMessage());
    } else {
      console.error(error);
    }
  } finally {
    saving.value = false;
  }
}

async function prepare () {
  try {
    loaded.value = false;

    const data = await getSharedSpace(currentRoute.value.params.id as string);

    Object.assign(sharedSpace, { parentUuid: '' }, data);
    Object.assign(formState, data);
    Object.assign(sharedSpaceDomain, store.getters['Domain/getDomainByUuid'](sharedSpace.domainUuid));

    if (sharedSpace.parentUuid) {
      const workspace = await getSharedSpace(sharedSpace.parentUuid);

      Object.assign(parentSpace, workspace);
    }

    loaded.value = true;
  } catch (error) {
    if (error instanceof APIError) {
      message.error(error.getMessage());
    } else {
      console.error(error);
    }

    push({ name: 'SharedSpacesList' });
  }
}

watchEffect(() => {
  if (currentRoute.value.params.id) {
    prepare();
  }
});
</script>

<style lang="less" scoped>
  .spinner {
    margin-top: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .info-block-container {
    display: flex;
    flex-wrap: wrap;
    border: 1px solid #F2F5F7;
    padding: 20px;
    border-radius: 4px;

    .info-block {
      flex: 0 1 50%;
      margin: 20px 0;

      .title {
        color: @text-color-secondary;
      }
    }
  }

  .delete-button-container {
    .ant-btn {
      background: @primary-8;
      color: @text-color-inverse;
    }
  }
</style>
