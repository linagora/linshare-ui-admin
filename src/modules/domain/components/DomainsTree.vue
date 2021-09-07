<template>
  <a-skeleton active v-if="isLoadingTree"/>

  <div class="domains-tree" v-else>
    <ul>
      <li>
        <div class="domains-tree__node">
          <a-button
            class="name"
            size="large"
            :title="domainsTree.name"
            :loading="domainsTreeStatus.loading === domainsTree.uuid"
            @click="setCurrentDomain(domainsTree.uuid)"
          >
            {{domainsTree.name}}
          </a-button>
          <a-dropdown :trigger="['click']">
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
                <a-menu-item key="1">
                  {{ $t('DOMAIN.CREATE_TOP_DOMAIN') }}
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </div>
        <ul>
          <li class="branch" v-for="topDomain in domainsTree.children" :key="topDomain.uuid">
            <div class="domains-tree__node">
              <a-button
                class="name"
                size="large"
                :title="topDomain.name"
                :loading="domainsTreeStatus.loading === topDomain.uuid"
                @click="setCurrentDomain(topDomain.uuid)"
              >
                {{topDomain.name}}
              </a-button>
              <a-dropdown :trigger="['click']">
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
                    <a-menu-item key="1">
                      {{ $t('DOMAIN.CREATE_SUB_DOMAIN') }}
                    </a-menu-item>
                    <a-menu-item key="1">
                      {{ $t('DOMAIN.CREATE_GUEST_DOMAIN') }}
                    </a-menu-item>
                  </a-menu>
                </template>
              </a-dropdown>
            </div>

            <ul>
              <li class="branch" v-for="subDomain in topDomain.children" :key="subDomain.uuid">
                <div class="domains-tree__node">
                  <a-button
                    class="name"
                    size="large"
                    :title="subDomain.name"
                    :loading="domainsTreeStatus.loading === subDomain.uuid"
                    @click="setCurrentDomain(subDomain.uuid)"
                  >
                    {{subDomain.name}}
                  </a-button>
                </div>
              </li>
            </ul>
          </li>
        </ul>
      </li>
    </ul>
  </div>

</template>

<script lang="ts">
import { useStore } from 'vuex';
import { defineComponent, computed, reactive, watchEffect } from 'vue';
import { PlusOutlined } from '@ant-design/icons-vue';
import Status from '@/core/types/Status';

interface DomainsTreeStatus {
  selected: string | null;
  loading: string | null;
}

export default defineComponent({
  name: 'DomainsTree',
  components: {
    PlusOutlined
  },
  setup () {
    const store = useStore();
    const domainsTreeStatus = reactive<DomainsTreeStatus>({
      selected: null,
      loading: null
    });
    const domainsTree = computed(() => store.getters['Domain/getDomainsTree']);
    const isLoadingTree = computed(() => store.getters['Domain/getStatus']('domainsTree') === Status.LOADING);
    const loggedUser = computed(() => store.getters['Auth/getLoggedUser']);

    watchEffect(() => {
      if (loggedUser.value.uuid) {
        store.dispatch('Domain/fetchDomainsTree');
      }
    });

    async function setCurrentDomain (uuid: string) {
      domainsTreeStatus.loading = uuid;

      await store.dispatch('Domain/fetchDomainById', uuid);

      domainsTreeStatus.loading = null;
      domainsTreeStatus.selected = uuid;
    }

    return {
      domainsTree,
      domainsTreeStatus,
      isLoadingTree,
      setCurrentDomain
    };
  }
});
</script>

<style lang="less">
  .domains-tree {
    &__node {
      display: flex;
      margin: 10px 0;

      .name {
        max-width: calc(100% - 40px);
        font-size: 14px;
        background: @background-color-base;
        font-weight: 400;
      }

      .name.ant-btn > span {
        overflow: hidden;
        max-width: 100%;
        text-overflow: ellipsis;
      }

      .name:not(:only-child) {
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
      }

      .dropdown-btn.ant-btn {
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
      }
    }

    li {
      list-style-type: none;
      position: relative;
    }

    li::before {
      position: absolute;
      left: 25px;
      width: 1px;
      height: 100%;
      margin: 22px 0 0;
      height: calc(100% - 40px);
      border-left: 1px solid @border-color-base;
      content: ' ';
    }
  }
</style>
