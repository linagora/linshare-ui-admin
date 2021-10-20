<template>
  <a-row>
    <a-col
      :xs="24"
      :sm="24"
      :md="{span: 16, offset: 4}"
    >
      <div class="page">
        <div
          v-for="page in pages"
          :key="page.title"
        >
          <a
            v-if="page.route || page.legacy"
            class="page__menu-item"
            @click="goToPage(page)"
          >
            <span>{{ $t(page.title) }}</span>
            <RightOutlined />
          </a>

          <div
            v-else
            class="page__menu-item"
          >
            <span>{{ $t(page.title) }}</span>
          </div>
        </div>
      </div>
    </a-col>
  </a-row>
</template>

<script lang='ts' setup>
import { RightOutlined } from '@ant-design/icons-vue';
import useDomainConfigurationPages from '../hooks/useDomainConfigurationPages';

const { pages, goToPage } = useDomainConfigurationPages();
</script>
