<template>
  <li>
    <div class="domains-tree__node">
      <a-button
        class="name"
        size="large"
        :title="node.name"
        :class="isActive(node) && 'active'"
        :loading="loading"
        @click="setCurrentDomain(node.uuid)"
      >
        {{ node.name }}
      </a-button>

      <a-dropdown
        v-if="node.type !== DOMAIN_TYPE.GUEST && node.type !== DOMAIN_TYPE.SUB"
        :trigger="['click']"
      >
        <a-button
          class="dropdown-btn"
          type="primary"
          size="large"
        >
          <template #icon>
            <PlusOutlined />
          </template>
        </a-button>

        <template #overlay>
          <a-menu>
            <a-menu-item
              v-if="node.type === DOMAIN_TYPE.ROOT"
              @click="onCreateButtonClick(DOMAIN_TYPE.TOP)"
            >
              {{ $t('DOMAIN.CREATE_TOP_DOMAIN') }}
            </a-menu-item>
            <a-menu-item
              v-if="node.type === DOMAIN_TYPE.TOP"
              @click="onCreateButtonClick(DOMAIN_TYPE.SUB)"
            >
              {{ $t('DOMAIN.CREATE_SUB_DOMAIN') }}
            </a-menu-item>
            <a-menu-item
              v-if="node.type === DOMAIN_TYPE.TOP && !guestDomainCreated(node)"
              @click="onCreateButtonClick(DOMAIN_TYPE.GUEST)"
            >
              {{ $t('DOMAIN.CREATE_GUEST_DOMAIN') }}
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </div>

    <ul v-if="node.children?.length">
      <DomainsTreeNode
        v-for="child in node.children"
        :key="child.uuid"
        :node="child"
        @on-create-button-click="event => $emit('onCreateButtonClick', event)"
      />
    </ul>
  </li>
</template>

<script lang="ts">
import { useStore } from 'vuex';
import { defineComponent, computed, ref, PropType } from 'vue';
import { PlusOutlined } from '@ant-design/icons-vue';
import { DOMAIN_TYPE } from '../types/Domain';
import DomainTreeNode from '../types/DomainTreeNode';

export default defineComponent({
  name: 'DomainsTreeNode',
  components: {
    PlusOutlined
  },
  props: {
    node: {
      type: Object as PropType<DomainTreeNode>,
      default: () => ({})
    }
  },
  emits: ['onCreateButtonClick'],
  setup (prop, { emit }) {
    const store = useStore();
    const loading = ref(false);
    const currentDomain = computed(() => store.getters['Domain/getCurrentDomain']);

    async function setCurrentDomain (uuid: string) {
      loading.value = true;

      await store.dispatch('Domain/fetchDomainById', uuid);

      loading.value = false;
    }

    function isActive (node: DomainTreeNode) {
      return node.uuid === currentDomain.value.uuid;
    }

    function guestDomainCreated (node: DomainTreeNode) {
      return node.children?.some((child: DomainTreeNode) => child.type === DOMAIN_TYPE.GUEST);
    }

    function onCreateButtonClick (type: string) {
      emit('onCreateButtonClick', {
        parent: {
          name: prop.node.name,
          uuid: prop.node.uuid
        },
        type
      });
    }

    return {
      onCreateButtonClick,
      guestDomainCreated,
      isActive,
      loading,
      setCurrentDomain,
      DOMAIN_TYPE
    };
  }
});
</script>
