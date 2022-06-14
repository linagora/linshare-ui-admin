<template>
  <div class="domains-tree">
    <ul>
      <DomainsTreeNode :node="domainsTree" @on-create-button-click="showModal" />
    </ul>
  </div>

  <DomainCreationFormModal
    :visible="modalProps.visible"
    :type="modalProps.type"
    :parent="modalProps.parent"
    @cancel="onCreateCancel"
    @success="onCreateSuccess"
  />
</template>

<script lang="ts" setup>
import { reactive } from 'vue';
import { storeToRefs } from 'pinia';
import { EMPTY_DOMAIN } from '../types/Domain';
import { useDomainStore } from '@/modules/domain/store';
import DomainsTreeNode from './DomainsTreeNode.vue';
import DomainCreationFormModal, { DomainCreationFormModalProps } from './DomainCreationFormModal.vue';

const domainStore = useDomainStore();
const modalProps = reactive<DomainCreationFormModalProps>({ visible: false });
const { domainsTree } = storeToRefs(domainStore);

function showModal(data: DomainCreationFormModalProps) {
  modalProps.visible = true;
  modalProps.parent = data.parent;
  modalProps.type = data.type;
}

function onCreateCancel() {
  modalProps.visible = false;
  modalProps.parent = EMPTY_DOMAIN;
}

function onCreateSuccess() {
  modalProps.visible = false;
  modalProps.parent = EMPTY_DOMAIN;
  domainStore.fetchDomainsTree();
}
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

    .name.active {
      background: @primary-1;
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
