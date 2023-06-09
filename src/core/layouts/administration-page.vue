<template>
  <a-row>
    <a-col :md="{ span: 16, offset: 4 }">
      <div class="page">
        <router-link :to="{ name: 'UsersList' }">
          <div class="page__menu-item">
            <span>{{ $t('NAVIGATOR.MY_USERS') }}</span>
            <RightOutlined />
          </div>
        </router-link>
        <router-link :to="{ name: 'SharedSpacesList' }">
          <div class="page__menu-item">
            <span>{{ $t('NAVIGATOR.MY_SHARED_SPACES') }}</span>
            <RightOutlined />
          </div>
        </router-link>
        <div class="page__menu-item" @click="redirect('NAVIGATOR.MY_CONTACT_LIST')">
          <span>{{ $t('NAVIGATOR.MY_CONTACT_LIST') }}</span>
          <RightOutlined />
        </div>
        <router-link v-if="isSuperAdmin" :to="{ name: 'InconsistentUserList' }">
          <div class="page__menu-item">
            <span>{{ $t('NAVIGATOR.INCONSISTENT_USERS') }}</span>
            <RightOutlined />
          </div>
        </router-link>
        <div class="page__menu-item">
          <span>{{ $t('NAVIGATOR.LOGGERS') }}</span>
        </div>
      </div>
    </a-col>
  </a-row>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { RightOutlined } from '@ant-design/icons-vue';
import useLegacyFeatures from '../hooks/useLegacyFeatures';
import { useAuthStore } from '@/modules/auth/store';
import { ACCOUNT_ROLE } from '@/modules/user/types/User';
import { storeToRefs } from 'pinia';

export default defineComponent({
  name: 'AdministrationPage',
  components: {
    RightOutlined,
  },
  setup() {
    const authStore = useAuthStore();
    const { loggedUserRole } = storeToRefs(authStore);

    const isSuperAdmin = computed(() => {
      return loggedUserRole.value === ACCOUNT_ROLE.SUPERADMIN;
    });

    const { redirect } = useLegacyFeatures();

    return {
      redirect,
      isSuperAdmin,
    };
  },
});
</script>
