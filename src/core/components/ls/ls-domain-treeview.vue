<template>
  <div class="ls-domain-treeview">
    <div class="ls-domain-treeview__domain-item" :class="{ active: isActive }" @click="setCurrentDomain(node)">
      <div v-if="isChildren" class="space"></div>
      <div v-if="node?.children?.length" class="dot dot__group">
        <template v-if="isRoot">
          <chevron-down-fill-icon class="icon expand" :class="{ 'expand--rotate': isExpand }" @click="onExpandChild">
          </chevron-down-fill-icon>
        </template>
        <template v-else>
          <chevron-down-fill-icon class="icon expand" :class="{ 'expand--rotate': isExpand }" @click="onExpandChild">
          </chevron-down-fill-icon>
          <group-domain-icon class="icon"></group-domain-icon>
        </template>
      </div>
      <div v-else class="dot">
        <dot-icon class="icon point"></dot-icon>
      </div>
      <div class="name">
        <span>{{ node?.name }}</span>
      </div>
      <div v-if="isActive" class="check">
        <check-circle-icon></check-circle-icon>
      </div>
    </div>
    <div v-if="node?.children?.length && isExpand" class="ls-domain-treeview__domain-sub-item">
      <ls-domain-treeview
        v-for="(item, index) in node?.children"
        :key="index + 'ls-domain-treeview' + item?.uuid"
        :is-children="true"
        :is-root="false"
        :level="currentLevel"
        :node="item"
      >
      </ls-domain-treeview>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed, ref } from 'vue';
import CheckCircleIcon from '@/core/components/icons/check-circle-icon.vue';
import GroupDomainIcon from '@/core/components/icons/group-domain-icon.vue';
import GlobeIcon from '@/core/components/icons/globe-icon.vue';
import DotIcon from '@/core/components/icons/dot-icon.vue';
import ChevronDownFillIcon from '@/core/components/icons/chevron-down-fill-icon.vue';
import { useDomainStore } from '@/modules/domain/store';
import { DOMAIN_TYPE } from '@/modules/domain/types/Domain';
import DomainTreeNode from '@/modules/domain/types/DomainTreeNode';
import { useRoute, useRouter } from 'vue-router';
import StatusValue from '@/core/types/Status';

const props = defineProps<{
  node: DomainTreeNode;
  isChildren?: boolean;
  level: number;
  isRoot: boolean;
}>();

const route = useRoute();
const router = useRouter();
const domainStore = useDomainStore();
const emit = defineEmits(['onCreateButtonClick']);

const isExpand = ref(true);

const currentDomainUuid = computed(() => domainStore.currentDomain?.uuid);
const currentLevel = computed(() => props.level + 1);

const loading = computed(
  () => currentDomainUuid.value === props.node?.uuid && domainStore.getStatus('currentDomain') === StatusValue.LOADING
);

function setCurrentDomain(node: DomainTreeNode) {
  domainStore.setCurrentDomain(node);

  if (route.params.domainUuid) {
    router.push({ name: route.name || undefined, params: { domainUuid: node.uuid } });
  }
}

const isActive = computed(() => {
  return props.node?.uuid === currentDomainUuid.value;
});

function guestDomainCreated(node: DomainTreeNode) {
  return node.children?.some((child: DomainTreeNode) => child.type === DOMAIN_TYPE.GUEST);
}

function onCreateButtonClick(type: string) {
  emit('onCreateButtonClick', {
    parent: {
      name: props.node.name,
      uuid: props.node.uuid,
    },
    type,
  });
}

function onExpandChild() {
  isExpand.value = !isExpand.value;
}
</script>
<style lang="less" scoped>
.ls-domain-treeview {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;

  &__domain-item {
    height: 48px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 0;
    border-radius: 8px;
    cursor: pointer;

    &.active {
      color: #007aff;
      background-color: #f2f8ff;
    }

    &:hover {
      color: #007aff;
      background-color: #f2f8ff;
    }

    .dot {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      position: relative;
    }

    .dot::after {
      content: '';
      width: 1px;
      height: 100%;
      background-color: #e4e5f0;
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      z-index: 1;
    }

    .dot__group::after {
      display: none;
    }

    .expand {
      &--rotate {
        transform: rotate(-90deg);
      }
    }

    .icon {
      margin: 8px;
    }

    .icon.point {
      margin: 16px;
      position: relative;
      z-index: 2;
    }

    .name {
      flex-grow: 1;
      font-style: normal;
      font-weight: 400;
      font-size: 16px;
      line-height: 20px;
      letter-spacing: -0.02em;
    }

    .check svg {
      width: 16px;
      height: 16px;
    }

    .space {
      width: calc(v-bind(level) * 40px);
    }
  }
}
</style>
<style lang="less">
.ls-domain-treeview {
  .ant-checkbox-inner {
    width: 20px;
    height: 20px;
  }
}
</style>
