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
        <div class="page__menu-item" @click="redirect('NAVIGATOR.INCONSISTENT_USERS')">
          <span>{{ $t('NAVIGATOR.INCONSISTENT_USERS') }}</span>
          <RightOutlined />
        </div>
        <div class="page__menu-item">
          <span>{{ $t('NAVIGATOR.LOGGERS') }}</span>
        </div>
      </div>
    </a-col>
  </a-row>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { RightOutlined } from '@ant-design/icons-vue';
import useLegacyFeatures from '../hooks/useLegacyFeatures';

export default defineComponent({
  name: 'AdministrationPage',
  components: {
    RightOutlined,
  },
  setup() {
    const { redirect } = useLegacyFeatures();

    return {
      redirect,
    };
  },
});
</script>
