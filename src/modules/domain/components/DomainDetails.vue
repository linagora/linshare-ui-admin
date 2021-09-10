<template>
  <PageTitle
    :title="'Domain details'"
    :subtitle="currentDomain.name"
    :breadcrumbs="breadcrumbs"
  >
    <template #subTitlePostfix>
      <div class="delete-domain-container">
        <a-button primary>
          {{ $t('DOMAIN.DELETE_DOMAIN') }}
        </a-button>
      </div>
    </template>
  </PageTitle>

  <div
    v-if="loadingDomain"
    class="spinner"
  >
    <a-spin />
  </div>

  <a-row
    v-else
    :gutter="24"
  >
    <a-col :span="12">
      <DomainForm :data="currentDomain" />
    </a-col>

    <a-col
      :span="10"
      :offset="2"
    >
      <div class="info-block-container">
        <div class="info-block">
          <div class="title">
            {{ $t('GENERAL.CREATION_DATE') }}
          </div>
          <div class="value">
            {{ $d(currentDomain.creationDate, 'mediumDate') }}
          </div>
        </div>
        <div class="info-block">
          <div class="title">
            {{ $t('GENERAL.MODIFICATION_DATE') }}
          </div>
          <div class="value">
            {{ $d(currentDomain.modificationDate, 'mediumDate') }}
          </div>
        </div>
        <div
          v-if="!isRootDomain"
          class="info-block"
        >
          <div class="title">
            {{ $t('DOMAIN.FIELDS.WELCOME_MESSAGE') }}
          </div>
          <div class="value">
            <a href="">{{ currentDomain.welcomeMessage.name }}</a>
          </div>
        </div>
        <div
          v-if="!isRootDomain"
          class="info-block"
        >
          <div class="title">
            {{ $t('DOMAIN.FIELDS.MAIL_CONFIGURATION') }}
          </div>
          <div class="value">
            <a href="">{{ currentDomain.mailConfiguration.name }}</a>
          </div>
        </div>
        <div
          v-if="!isRootDomain"
          class="info-block"
        >
          <div class="title">
            {{ $t('DOMAIN.FIELDS.MIME_POLICY') }}
          </div>
          <div class="value">
            <a href="">{{ currentDomain.mimePolicy.name }}</a>
          </div>
        </div>
        <div
          v-if="!isRootDomain"
          class="info-block"
        >
          <div class="title">
            {{ $t('DOMAIN.FIELDS.DOMAIN_POLICY') }}
          </div>
          <div class="value">
            <a href="">{{ currentDomain.domainPolicy.name }}</a>
          </div>
        </div>
      </div>
    </a-col>
  </a-row>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useStore } from 'vuex';
import useBreadcrumbs from '@/core/hooks/useBreadcrumbs';
import PageTitle from '@/core/components/PageTitle.vue';
import DomainForm from '@/modules/domain/components/DomainForm.vue';
import Status from '@/core/types/Status';

export default defineComponent({
  name: 'DomainDetails',
  components: {
    PageTitle,
    DomainForm
  },
  setup () {
    const store = useStore();
    const currentDomain = computed(() => store.getters['Domain/getCurrentDomain']);
    const loadingDomain = computed(() => store.getters['Domain/getStatus']('currentDomain') === Status.LOADING);
    const { breadcrumbs } = useBreadcrumbs();

    return {
      breadcrumbs,
      currentDomain,
      loadingDomain,
      isRootDomain: computed(() => store.getters['Domain/isRootDomain'])
    };
  }
});
</script>

<style lang="less" scoped>
  .spinner {
    height: 100%;
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
    margin-top: 30px;

    .info-block {
      flex: 0 1 50%;
      margin: 20px 0;

      .title {
        color: @text-color-secondary;
      }
    }
  }

  .delete-domain-container {
    .ant-btn {
      background: @primary-8;
      color: @text-color-inverse;
    }
  }
</style>
