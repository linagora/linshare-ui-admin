<template>
  <a-row>
    <a-col :md="{span: 16, offset: 4}">
      <div class="page">
        <div v-for="entry in entries" :key="entry.title">
          <router-link v-if="entry.route" :to="entry.route">
            <div class="page__menu-item">
              <span>{{ $t(entry.title) }}</span>
              <RightOutlined />
            </div>
          </router-link>

          <div class="page__menu-item" v-else>
              <span>{{ $t(entry.title) }}</span>
          </div>
        </div>
      </div>
    </a-col>
  </a-row>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { RightOutlined } from '@ant-design/icons-vue';
import useDomainManagementEntries from '@/modules/domain/hooks/useDomainManagementEntries';

export default defineComponent({
  name: 'DomainManagement',
  components: {
    RightOutlined
  },
  setup () {
    const { entries } = useDomainManagementEntries();

    return {
      entries
    };
  }
});
</script>
