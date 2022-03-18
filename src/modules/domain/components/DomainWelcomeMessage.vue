<template>
  <PageTitle :title="$t('NAVIGATOR.WELCOME_MESSAGES_MANAGE')" :breadcrumbs="breadcrumbs"></PageTitle>
  <a-row>
    <a-col :xs="24" :sm="24" :md="{ span: 18, offset: 2 }">
      <DomainWelcomeMessageForm :data="welcomeMessage" @delete="confirmDelete" @submit="setSubmit" />
    </a-col>
  </a-row>
  <a-back-top class="back-top"> <ArrowUpOutlined /> </a-back-top>
</template>

<script lang="ts" setup>
import { computed, reactive, onMounted, watch } from 'vue';
import PageTitle from '@/core/components/PageTitle.vue';
import useBreadcrumbs from '@/core/hooks/useBreadcrumbs';
import DomainWelcomeMessageForm from './DomainWelcomeMessageForm.vue';
import { useStore } from 'vuex';
import {
  getWelcomeMessage,
  updateWelcomeMessage,
  createWelcomeMessage,
  deleteWelcomeMessage,
} from '../services/domain-api';
import { message } from 'ant-design-vue';
import { APIError } from '@/core/types/APIError';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import WelcomeMessage, { EMPTY_WELCOME_MESSAGE } from '../types/WelcomeMessages';
import useNotification from '@/core/hooks/useNotification';
import { ArrowUpOutlined } from '@ant-design/icons-vue';

const store = useStore();
const router = useRouter();
const { t } = useI18n();
const { breadcrumbs } = useBreadcrumbs();
const { confirmModal } = useNotification();
const currentDomain = computed(() => store.getters['Domain/getCurrentDomain']);
const welcomeMessage = reactive<WelcomeMessage>({ ...EMPTY_WELCOME_MESSAGE });

function setSubmit(data: WelcomeMessage) {
  if (router.currentRoute.value.name === 'DomainWelcomeMessageDetails') {
    update(data);
  } else {
    create(data);
  }
}

async function getWelcomeMessageInformations() {
  if (router.currentRoute.value.name === 'DomainWelcomeMessageDetails') {
    try {
      const message = await getWelcomeMessage(
        currentDomain.value.uuid,
        router.currentRoute.value.params.uuid as string
      );
      Object.assign(welcomeMessage, message);
    } catch (error) {
      if (error instanceof APIError) {
        message.error(error.getMessage());

        if (error.errorCode === 36004) {
          router.push({ name: 'WelcomeMessages' });
        }
      }
    }
  }
}

async function create(data: WelcomeMessage) {
  try {
    await createWelcomeMessage(currentDomain.value.uuid, data);
    router.push({ name: 'WelcomeMessages' });
    message.success(t('MESSAGES.CREATE_SUCCESS'));
  } catch (error) {
    if (error instanceof APIError) {
      message.error(error.getMessage());
    }
  }
}

async function update(data: WelcomeMessage) {
  try {
    const updated = await updateWelcomeMessage(currentDomain.value.uuid, data);
    Object.assign(welcomeMessage, updated);
    message.success(t('MESSAGES.UPDATE_SUCCESS'));
  } catch (error) {
    if (error instanceof APIError) {
      message.error(error.getMessage());
    }
  }
}

async function deleteMessage() {
  try {
    await deleteWelcomeMessage(currentDomain.value.uuid, welcomeMessage.uuid);
    router.push({ name: 'WelcomeMessages' });
    message.success(t('MESSAGES.DELETE_SUCCESS'));
  } catch (error) {
    if (error instanceof APIError) {
      message.error(error.getMessage());
    }
  }
}

function confirmDelete() {
  confirmModal({
    title: t('GENERAL.DELETION'),
    content: t('WELCOME_MESSAGES.DELETE_CONFIRM'),
    okText: t('GENERAL.DELETE'),
    onOk: deleteMessage,
  });
}

onMounted(getWelcomeMessageInformations);
watch(
  () => router.currentRoute.value.params.uuid,
  (newUuid) => {
    if (newUuid) {
      getWelcomeMessageInformations();
    }
  }
);
</script>

<style lang="less" scoped>
.back-top {
  font-size: x-large;
  color: @primary-color;
}
</style>
