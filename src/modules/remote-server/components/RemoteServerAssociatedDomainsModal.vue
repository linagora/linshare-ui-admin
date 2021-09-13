<template>
  <a-modal
    :visible="visible"
    :title="$t('GENERAL.ASSOCIATED_DOMAINS')"
  >
    <template #footer>
      <a-button @click="onOk" type="primary">{{ $t('GENERAL.OK') }}</a-button>
    </template>

    <a-spin v-if="loading"/>
    <div v-else>
      <div v-for="domain in list" :key="domain.uuid">
        <span>{{domain.name}}</span>
      </div>
    </div>
  </a-modal>
</template>

<script lang="ts">
import { defineComponent, ref, watchEffect, PropType } from 'vue';
import RemoteServerAPIClient from '../services/RemoteServerAPICLient';
import RemoteServer from '../types/RemoteServer';
import Domain from '@/modules/domain/type/Domain';

export default defineComponent({
  name: 'RemoteServerLDAPModal',
  props: {
    visible: {
      type: Boolean
    },
    data: {
      type: Object as PropType<RemoteServer>
    }
  },
  setup (props, { emit }) {
    const loading = ref(true);
    const list = ref<Domain[]>([]);

    function onOk () {
      emit('ok');
    };

    watchEffect(() => {
      if (props.data?.uuid) {
        loading.value = true;

        RemoteServerAPIClient.getAssociatedDomains(props.data?.uuid)
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
      onOk
    };
  }
});
</script>

<style lang="less" scoped>
  .ant-form-item small {
    color: @text-color-secondary;
  }

  .footer {
    display: flex;
    justify-content: space-between;
  }
</style>
