<template>
  <a-modal
    :visible="visible"
    :title="$t('GENERAL.ASSOCIATED_DOMAINS')"
    @cancel="emitOk"
  >
    <template #footer>
      <a-button
        type="primary"
        @click="emitOk"
      >
        {{ $t('GENERAL.OK') }}
      </a-button>
    </template>

    <a-list
      :data-source="list"
      :loading="loading"
      :locale="{ emptyText: $t('REMOTE_SERVER.NO_ASSOCIATED_DOMAIN') }"
    >
      <template #renderItem="{ item }">
        <a-list-item class="domain-list-item">
          {{ item.name }}

          <template #actions>
            <a-tag>{{ $t(`DOMAIN.TYPES.${item.type}`) }}</a-tag>
          </template>
        </a-list-item>
      </template>
    </a-list>
  </a-modal>
</template>

<script lang="ts">
import { defineComponent, ref, watchEffect, PropType } from 'vue';
import { getAssociatedDomains } from '../services/remote-server-api';
import RemoteServer from '../types/RemoteServer';
import Domain from '@/modules/domain/types/Domain';

export default defineComponent({
  name: 'RemoteServerLDAPModal',
  props: {
    visible: {
      type: Boolean
    },
    data: {
      type: Object as PropType<RemoteServer | Record<string, never>>,
      default: () => ({})
    }
  },
  emits: ['ok', 'cancel'],
  setup (props, { emit }) {
    const loading = ref(true);
    const list = ref<Domain[]>([]);

    function emitOk () {
      emit('ok');
    }

    watchEffect(() => {
      if (props.data?.uuid) {
        loading.value = true;

        getAssociatedDomains(props.data?.uuid)
          .then(domains => {
            list.value = domains;
          })
          .finally(() => {
            loading.value = false;
          });
      }
    });

    return {
      loading,
      list,
      emitOk
    };
  }
});
</script>

<style lang="less" scoped>
  .domain-list-item {
    border-bottom: 1px solid @border-color-base;

    .ant-tag {
      color: @primary-4
    }
  }
</style>
