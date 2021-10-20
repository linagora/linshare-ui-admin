<template>
  <PageTitle
    :title="$t('NAVIGATOR.PROVIDERS')"
    :breadcrumbs="breadcrumbs"
  />

  <a-row>
    <a-col :span="24">
      <div class="page">
        <router-link :to="{ name: 'DomainUserProviders' }">
          <div class="page__menu-item">
            <span>{{ $t("NAVIGATOR.USER_PROVIDERS") }}</span>
            <RightOutlined />
          </div>
        </router-link>
        <div
          class="page__menu-item"
          @click="redirect('NAVIGATOR.GROUP_PROVIDERS')"
        >
          <span>{{ $t("NAVIGATOR.GROUP_PROVIDERS") }}</span>
          <RightOutlined />
        </div>
        <div
          class="page__menu-item"
          @click="redirect('NAVIGATOR.DRIVE_PROVIDERS')"
        >
          <span>{{ $t("NAVIGATOR.DRIVE_PROVIDERS") }}</span>
          <RightOutlined />
        </div>
      </div>
    </a-col>
  </a-row>
</template>

<script lang='ts' setup>
import PageTitle from '@/core/components/PageTitle.vue';
import { RightOutlined } from '@ant-design/icons-vue';
import useBreadcrumbs from '@/core/hooks/useBreadcrumbs';
import useLegacyFeatures from '@/core/hooks/useLegacyFeatures';

const { redirect } = useLegacyFeatures();
const { breadcrumbs } = useBreadcrumbs();
</script>
