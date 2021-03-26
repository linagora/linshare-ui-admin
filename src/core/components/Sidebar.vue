<template>
  <div class="sidebar">
    <div class="logo-container">
      <router-link :to="{ name: 'dashboard' }">
        <img
          src="@/assets/images/linshare-logo-white.png"
          :alt="$t('HEADER.LOGO_ALT')"
        >
      </router-link>
    </div>
    <div class="search-container">
      <a-input
        v-model="search"
        :placeholder="$t('NAVIGATOR.SEARCH')"
        class="sidebar-search-input"
      >
        <template #prefix>
          <search-outlined/>
        </template>
      </a-input>
    </div>
    <a-menu
      :default-selected-keys="[]"
      :openKeys="menu.openKeys"
      mode="inline"
      class="ls-sidebar-menu"
    >
      <MenuItemRecursive @subMenuClick="subMenuClick" v-for="item in menuTree" :key="item.key" :item="item" />
    </a-menu>
  </div>
</template>

<script lang='ts'>
import { defineComponent, reactive } from 'vue';
import { SearchOutlined } from '@ant-design/icons-vue';
import { menuTree } from '@/core/helper';
import MenuItemRecursive from '@/core/components/MenuItemRecursive.vue';

export default defineComponent({
  name: 'Sidebar',
  components: {
    SearchOutlined,
    MenuItemRecursive
  },
  setup () {
    const menu = reactive({
      openKeys: [] as string[]
    });
    const search = '';

    function subMenuClick (e: { key: string }) {
      if (menu.openKeys.includes(e.key)) {
        menu.openKeys = menu.openKeys.filter(key => key !== e.key);
      } else {
        menu.openKeys = [...menu.openKeys, e.key];
      }
    }

    return {
      menu,
      search,
      menuTree,
      subMenuClick
    };
  }
});
</script>

<style lang="less">
  @import '@/assets/styles/variables';
  .sidebar {
    overflow: auto;
    height: 100vh;
    background: @dark-blue;

    .logo-container {
      padding: 20px;
      text-align: center;
    }

    .search-container {
      padding: 10px 20px;

      .sidebar-search-input {
        width: 100%;
        background: rgba(255, 255, 255, 0.15);
        border: 0px;

        .ant-input-prefix {
          color: @white;
        }

        input {
          background: transparent;
          padding: 3px;
          color: @white;
        }
      }
    }

    .ls-sidebar-menu {
      background: inherit;
      color: @white;

      span {
        color: @white;
      }

      li {
        width: 100%;

        .ant-menu-submenu-arrow {
          color: @white;
          &::before,
          &::after {
            background-image: none;
          }
        }

        .ant-menu-sub {
          color: @white;
          box-shadow: none;
          background: inherit;
          .ant-menu-item:hover,
          .ant-menu-item:focus,
          .ant-menu-item:active {
            background: @light-blue;
          }
          li {
            color: @white;
          }
        }
      }

      .ant-menu-item.ant-menu-item-selected {
        background-color: @light-blue;
      }

      .ant-menu-submenu-title:hover,
      .ant-menu-submenu-title:focus,
      .ant-menu-submenu-title:active {
        background: @light-blue;
        span {
          color: @white;
        }
        .ant-menu-submenu-arrow {
          color: @white;
          &::before,
          &::after {
            background: #fff;
            background-image: none;
          }
        }
      }
    }
  }
</style>
