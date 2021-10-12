<template>
  <PageTitle
    :title="$t('NAVIGATOR.REMOTE_FILTERS')"
    :breadcrumbs="breadcrumbs"
  >
    <template #helperContent>
      <div>{{ $t('DOMAIN.REMOTE_FILTERS_HELPER') }}</div>
    </template>
  </PageTitle>

  <a-row>
    <a-col :span="24">
      <div class="page">
        <router-link :to="{ name: 'UserFilters' }">
          <div
            class="page__menu-item"
          >
            <span>{{ $t("NAVIGATOR.USER_FILTERS") }}</span>
            <RightOutlined />
          </div>
        </router-link>
        <div
          class="page__menu-item"
          @click="redirect('NAVIGATOR.DRIVE_FILTERS')"
        >
          <span>{{ $t("NAVIGATOR.GROUP_FILTERS") }}</span>
          <RightOutlined />
        </div>
        <div
          class="page__menu-item"
        >
          <span>{{ $t("NAVIGATOR.DRIVE_FILTERS") }}</span>
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
