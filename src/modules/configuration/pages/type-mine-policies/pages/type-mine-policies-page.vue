<template>
  <div>
    <div>
      <a-alert closable>
        <template #description>
          <ul>
            <li>{{ $t('MIME_POLICIES.CREATE_DESCRIPTION') }}</li>
            <li>{{ $t('MIME_POLICIES.FILTER_DESCRIPTION') }}</li>
            <li>{{ $t('MIME_POLICIES.ENABLED_DESCRIPTION') }}</li>
            <li
              v-html="
                $t('MIME_POLICIES.MANAGE_DESCRIPTION', {
                  domain_link: `${$t('MIME_POLICIES.MANAGE_DOMAIN')}`,
                  url: `${domainLink}/configuration/${currentDomainUuid}/detail`,
                })
              "
            ></li>
          </ul>
        </template>
      </a-alert>
    </div>
    <div class="actions">
      <a-input :placeholder="$t('GENERAL.SEARCH_BY_NAME')" class="searchbox" allow-clear>
        <template #prefix>
          <SearchOutlined />
        </template>
      </a-input>
      <a-button type="primary">
        <template #icon>
          <PlusCircleOutlined />
        </template>
        {{ $t('GENERAL.CREATE') }}
      </a-button>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { PlusCircleOutlined, SearchOutlined } from '@ant-design/icons-vue';

const route = useRoute();
const router = useRouter();
const domainLink = window.location.origin;
const currentDomainUuid = computed(() => {
  return route.params.domainUuid;
});
</script>

<style lang="less" scoped>
.actions {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  margin-top: 20px;
}
.actions > .searchbox {
  width: 500px;
  margin-right: 10px;
}

.delete_text {
  color: @error-color;
}

.elipsis-name {
  min-width: 100px;
  white-space: nowrap;
  overflow: hidden;
  display: block;
  text-overflow: ellipsis;
}
</style>
