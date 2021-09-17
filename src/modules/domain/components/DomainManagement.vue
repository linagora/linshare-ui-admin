<template>
  <a-row>
    <a-col :md="{span: 16, offset: 4}">
      <div class="page">
        <div v-for="page in pages" :key="page.title">
          <a v-if="page.route || page.legacy" @click="goToPage(page)" class="page__menu-item">
            <span>{{ $t(page.title) }}</span>
            <RightOutlined />
          </a>

          <div class="page__menu-item" v-else>
            <span>{{ $t(page.title) }}</span>
          </div>
        </div>
      </div>
    </a-col>
  </a-row>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { RightOutlined } from '@ant-design/icons-vue';
import useDomainConfigurationPages from '@/modules/domain/hooks/useDomainConfigurationPages';

export default defineComponent({
  name: 'DomainManagement',
  components: {
    RightOutlined
  },
  setup () {
    const { pages, goToPage } = useDomainConfigurationPages();

    return {
      pages,
      goToPage
    };
  }
});
</script>
