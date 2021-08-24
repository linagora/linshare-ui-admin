<template>
  <a-row>
    <a-col :md="{span: 16, offset: 4}">
      <div class="page">
        <router-link :to="{ name: 'DomainDetails' }">
          <div class="page__menu-item">
            <span>{{ $t('NAVIGATOR.DETAILS') }}</span>
            <RightOutlined />
          </div>
        </router-link>
        <div class="page__menu-item">
          <span>{{ $t('NAVIGATOR.PARAMETERS') }}</span>
          <RightOutlined />
        </div>
        <div class="page__menu-item">
          <span>{{ $t('NAVIGATOR.MAIL_TEMPLATES') }}</span>
          <RightOutlined />
        </div>
        <div class="page__menu-item">
          <span>{{ $t('NAVIGATOR.WELCOME_MESSAGES') }}</span>
          <RightOutlined />
        </div>
        <div class="page__menu-item">
          <span>{{ $t('NAVIGATOR.TYPE_MIME') }}</span>
          <RightOutlined />
        </div>
        <div class="page__menu-item">
          <span>{{ $t('NAVIGATOR.PROVIDERS') }}</span>
          <RightOutlined />
        </div>
        <div class="page__menu-item">
          <span>{{ $t('NAVIGATOR.QUOTA') }}</span>
          <RightOutlined />
        </div>
        <div class="page__menu-item">
          <span>{{ $t('NAVIGATOR.PUBLIC_KEYS') }}</span>
          <RightOutlined />
        </div>
      </div>
    </a-col>
  </a-row>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { RightOutlined } from '@ant-design/icons-vue';

export default defineComponent({
  name: 'ConfigurationEntries',
  components: {
    RightOutlined
  }
});
</script>
