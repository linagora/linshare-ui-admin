<template>
  <div class="administration-router">
    <div v-for="(menu, index) in menus" :key="index" class="administration-router-item" @click="menu.to">
      <component :is="menu.icon" />
      <div class="administration-router-content">
        <strong>{{ menu.name }}</strong>
        <span>{{ menu.subTitle }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { RightOutlined } from '@ant-design/icons-vue';
import { useAuthStore } from '@/modules/auth/store';
import { ACCOUNT_ROLE } from '@/modules/user/types/User';
import { storeToRefs } from 'pinia';
import { ADMINISTRATIONS_TEMPLATES_ROUTE_NAMES } from '@/modules/administration/router';
import { useRouter } from 'vue-router';
import MyUsers from '@/core/components/icons/my-users.vue';
import MyDrive from '@/core/components/icons/my-drive.vue';
import MyContact from '@/core/components/icons/my-contact.vue';
import InconsistentUsers from '@/core/components/icons/inconsistent-users.vue';
import LoggersIcon from '@/core/components/icons/loggers-icon.vue';
import { useI18n } from 'vue-i18n';

export default defineComponent({
  name: 'AdministrationEntriesPage',
  components: {
    RightOutlined,
  },
  setup() {
    const authStore = useAuthStore();
    const router = useRouter();
    const { loggedUserRole } = storeToRefs(authStore);
    const { t } = useI18n();

    const isSuperAdmin = computed(() => {
      return loggedUserRole.value === ACCOUNT_ROLE.SUPERADMIN;
    });

    const menus = computed(() => {
      return [
        {
          name: t('ADMINISTRATION.NAVIGATOR.MY_USERS'),
          subTitle: t('ADMINISTRATION.NAVIGATOR.MY_USRES_SUBTITLE'),
          icon: MyUsers,
          to: () => {
            router.push({ name: ADMINISTRATIONS_TEMPLATES_ROUTE_NAMES.MY_USERS_ROUTE_NAMES.USER_LIST });
          },
        },
        {
          name: t('ADMINISTRATION.NAVIGATOR.MY_DRIVE'),
          subTitle: t('ADMINISTRATION.NAVIGATOR.MY_DRIVE_SUBTITLE'),
          icon: MyDrive,
          to: () => {
            router.push({ name: ADMINISTRATIONS_TEMPLATES_ROUTE_NAMES.MY_SHARED_SPACES_ROUTE_NAMES.SHARE_SPACES_LIST });
          },
        },
        {
          name: t('ADMINISTRATION.NAVIGATOR.MY_CONTACT_LIST'),
          subTitle: t('ADMINISTRATION.NAVIGATOR.MY_CONTACT_LIST_SUBTITLE'),
          icon: MyContact,
          to: () => {
            router.push({ name: ADMINISTRATIONS_TEMPLATES_ROUTE_NAMES.CONTACT_LISTS_ROUTE_NAMES.CONTACT_LIST });
          },
        },
        {
          name: t('ADMINISTRATION.NAVIGATOR.INCONSISTENT_USERS'),
          subTitle: t('ADMINISTRATION.NAVIGATOR.INCONSISTENT_USERS_SUBTITLE'),
          icon: InconsistentUsers,
          to: () => {
            router.push({
              name: ADMINISTRATIONS_TEMPLATES_ROUTE_NAMES.INCONSISTENT_USERS_ROUTE_NAMES.INCONSISTENT_LIST,
            });
          },
        },
        {
          name: t('ADMINISTRATION.NAVIGATOR.LOGGERS'),
          subTitle: t('ADMINISTRATION.NAVIGATOR.LOGGERS_SUBTITLE'),
          icon: LoggersIcon,
          to: () => {
            router.push({ name: ADMINISTRATIONS_TEMPLATES_ROUTE_NAMES.LOGGERS });
          },
        },
      ];
    });

    return {
      menus,
      isSuperAdmin,
    };
  },
});
</script>
<style lang="less">
.administration-router {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: stretch;
  gap: 24px;
  flex-wrap: wrap;
  padding-top: 104px;
  padding-bottom: 104px;
  &-item {
    display: flex;
    width: 296px;
    padding: 20px;
    flex-direction: column;
    align-items: center;
    border-radius: 16px;
    background-color: #fff;
    color: #000;
    cursor: pointer;
  }
  &-item:hover strong {
    color: #007aff;
  }
  &-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }
  &-content span {
    color: var(--neutral-colors-color-placeholder, #989cb1);
    text-align: center;
    /* Desktop/Body 2 - Regular */
    font-family: Inter;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 20px; /* 142.857% */
    letter-spacing: -0.14px;
  }
  &-content strong {
    color: var(--neutral-colors-color-text-primary, #343745);
    text-align: center;
    /* Desktop/Title 3 - Semibold */
    font-family: Inter;
    font-size: 20px;
    font-style: normal;
    font-weight: 600;
    line-height: 24px; /* 120% */
  }
}
</style>
