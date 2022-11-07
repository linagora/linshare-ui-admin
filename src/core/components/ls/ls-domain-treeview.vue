<template>
  <div class="ls-domain-treeview">
    <div v-if="!domain?.subs" class="ls-domain-treeview__domain-item">
      <div v-if="isSub" class="space"></div>
      <div class="checkbox">
        <a-checkbox></a-checkbox>
      </div>
      <div class="dot">
        <dot-icon></dot-icon>
      </div>
      <div class="name">
        <span>{{ domain?.name }}</span>
      </div>
      <div class="check">
        <check-circle-icon></check-circle-icon>
      </div>
    </div>
    <div v-else class="ls-domain-treeview__domain-sub">
      <div class="ls-domain-treeview__domain-item">
        <div v-if="isSub" class="space"></div>
        <div class="checkbox">
          <a-checkbox></a-checkbox>
        </div>
        <div class="dot dot__group">
          <globe-icon v-if="isRoot"></globe-icon>
          <group-domain-icon v-else></group-domain-icon>
        </div>
        <div class="name">
          <span>{{ domain?.name }}</span>
        </div>
        <div class="check">
          <check-circle-icon></check-circle-icon>
        </div>
      </div>
      <div class="ls-domain-treeview__domain-sub-item">
        <ls-domain-treeview
          v-for="(item, index) in domain?.subs"
          :key="index + 'ls-domain-treeview' + item?.name"
          :is-sub="isSubDomain"
          :is-root="false"
          :level="currentLevel"
          :domain="item"
        >
        </ls-domain-treeview>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import CheckCircleIcon from '@/core/components/icons/check-circle-icon.vue';
import DotIcon from '@/core/components/icons/dot-icon.vue';
import GroupDomainIcon from '@/core/components/icons/group-domain-icon.vue';
import GlobeIcon from '@/core/components/icons/globe-icon.vue';
import { computed } from 'vue';
import Domain from '@/core/types/Domain';
const props = defineProps<{
  domain: Domain;
  isSub: boolean;
  level: number;
  isRoot: boolean;
}>();

const currentLevel = computed(() => {
  return props.level + 1;
});

const isSubDomain = computed(() => {
  return props.domain?.subs;
});
</script>
<style lang="less" scoped>
.ls-domain-treeview {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;

  &__domain-item {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding-top: 12px;
    padding-bottom: 12px;
    padding-right: 18px;
    padding-left: 18px;
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
      margin: 0 18px;
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
      z-index: 10;
    }

    .dot__group::after {
      display: none;
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
