<template>
  <div class="ls-domain-treeview">
    <div class="ls-domain-treeview__domain-item" :class="{ active: isActive }" @click="selectDomain">
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
        :active-node="activeNode"
        @select="onSelectChildDomain($event)"
      >
      </ls-domain-treeview>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed, reactive, ref } from 'vue';
import DotIcon from '@/core/components/icons/dot-icon.vue';
import DomainTreeNode from '@/modules/domain/types/DomainTreeNode';
import CheckCircleIcon from '@/core/components/icons/check-circle-icon.vue';
import GroupDomainIcon from '@/core/components/icons/group-domain-icon.vue';
import ChevronDownFillIcon from '@/core/components/icons/chevron-down-fill-icon.vue';

// props/emits
const props = defineProps<{
  activeNode?: DomainTreeNode;
  node: DomainTreeNode;
  isChildren?: boolean;
  level: number;
  isRoot: boolean;
}>();
const emits = defineEmits(['select']);

// data
const isExpand = ref(true);

// computed
const currentLevel = computed(() => props.level + 1);

const isActive = computed(() => {
  return props.node?.uuid === props.activeNode?.uuid;
});

// methods
function selectDomain() {
  emits('select', props.node);
}

function onExpandChild() {
  isExpand.value = !isExpand.value;
}

function onSelectChildDomain(domain: DomainTreeNode) {
  emits('select', domain);
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
    align-items: stretch;
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
      border-right: 1px solid #e4e5f0;
      height: 100%;
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
      color: #989cb1;
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
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;
    }

    .check {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      padding: 16px;
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
