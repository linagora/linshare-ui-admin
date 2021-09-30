<template>
  <li>
    <div class="domains-tree__node">
      <a-button
        class="name"
        size="large"
        :title="node.name"
        :class="isActive(node) && 'active'"
        :loading="isLoading(node)"
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
            <a-menu-item v-if="node.type === DOMAIN_TYPE.ROOT">
              {{ $t('DOMAIN.CREATE_TOP_DOMAIN') }}
            </a-menu-item>
            <a-menu-item v-if="node.type === DOMAIN_TYPE.TOP">
              {{ $t('DOMAIN.CREATE_SUB_DOMAIN') }}
            </a-menu-item>
            <a-menu-item v-if="node.type === DOMAIN_TYPE.TOP && !guestDomainCreated(node)">
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
      />
    </ul>
  </li>
</template>

<script lang="ts">
import { useStore } from 'vuex';
import { defineComponent, computed, reactive, PropType } from 'vue';
import { PlusOutlined } from '@ant-design/icons-vue';
import DomainTreeNode from '../type/DomainTreeNode';
import { DOMAIN_TYPE } from '../type/Domain';

interface DomainsTreeStatus {
  selected: string | null;
  loading: string | null;
}
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
  setup () {
    const store = useStore();
    const domainsTreeStatus = reactive<DomainsTreeStatus>({
      selected: null,
      loading: null
    });
    const currentDomain = computed(() => store.getters['Domain/getCurrentDomain']);

    async function setCurrentDomain (uuid: string) {
      domainsTreeStatus.loading = uuid;

      await store.dispatch('Domain/fetchDomainById', uuid);

      domainsTreeStatus.loading = null;
      domainsTreeStatus.selected = uuid;
    }

    function isLoading (node: DomainTreeNode) {
      return node.uuid === domainsTreeStatus.loading;
    }

    function isActive (node: DomainTreeNode) {
      return node.uuid === currentDomain.value.uuid;
    }

    function guestDomainCreated (node: DomainTreeNode) {
      return node.children?.some((child: DomainTreeNode) => child.type === DOMAIN_TYPE.GUEST);
    };

    return {
      guestDomainCreated,
      isLoading,
      isActive,
      setCurrentDomain,
      DOMAIN_TYPE
    };
  }
});
</script>
