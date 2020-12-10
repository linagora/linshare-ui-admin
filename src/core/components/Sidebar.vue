<template>
  <div class="sidebar">
    <div class="logo-container">
      <img
        src="../../assets/images/linshare-logo-white.png"
        :alt="$t('HEADER.LOGO_ALT')"
      >
    </div>
    <div class="search-container">
      <a-input
        v-model="search"
        :placeholder="$t('NAVIGATOR.SEARCH')"
        @search="onSearch"
        class="sidebar-search-input"
      >
        <template #prefix>
          <search-outlined/>
        </template>
      </a-input>
    </div>
    <a-menu
      :default-selected-keys="['1']"
      mode="inline"
      class="ls-sidebar-menu"
      @click="handleClick"
      theme="dark"
    >
      <a-sub-menu key="domain" @titleClick="titleClick">
        <template v-slot:title>
          <span>
            <cloud-outlined />
            <span>{{ $t('NAVIGATOR.DOMAINS') }}</span>
          </span>
        </template>
        <a-menu-item key="manage-domains">
          {{ $t('NAVIGATOR.MANAGE_DOMAINS') }}
        </a-menu-item>
        <a-menu-item key="functionalities">
          {{ $t('NAVIGATOR.FUNCTIONALITIES') }}
        </a-menu-item>
      </a-sub-menu>
      <a-sub-menu key="user" @titleClick="titleClick">
        <template v-slot:title>
          <span>
            <team-outlined />
            <span>{{ $t('NAVIGATOR.USERS') }}</span>
          </span>
        </template>
        <a-menu-item key="manage-users">
          {{ $t('NAVIGATOR.MANAGE_USERS') }}
        </a-menu-item>
        <a-menu-item key="inconsisten-users">
          {{ $t('NAVIGATOR.INCONSISTENT_USERS')}}
        </a-menu-item>
        <a-menu-item key="technical-accounts">
          {{ $t('NAVIGATOR.TECHNICAL_ACCOUNTS')}}
        </a-menu-item>
      </a-sub-menu>
      <a-menu-item key="workgroup">
        <span>
          <folder-open-outlined />
          <span>{{ $t('NAVIGATOR.WORKGROUPS') }}</span>
        </span>
      </a-menu-item>
      <a-menu-item key="mailing-list">
        <span>
          <unordered-list-outlined />
          <span>{{ $t('NAVIGATOR.MAILING_LISTS') }}</span>
        </span>
      </a-menu-item>
      <a-menu-item key="history">
        <span>
          <clock-circle-outlined />
          <span>{{ $t('NAVIGATOR.HISTORY') }}</span>
        </span>
      </a-menu-item>
      <a-sub-menu key="mails">
        <template v-slot:title>
          <span>
            <mail-outlined />
            <span>{{ $t('NAVIGATOR.MAILS') }}</span>
          </span>
        </template>
        <a-menu-item key="mail-configuration">
          {{ $t('NAVIGATOR.MAIL_CONFIGURATION')}}
        </a-menu-item>
        <a-menu-item key="mail-layout">
          {{ $t('NAVIGATOR.MAIL_LAYOUT') }}
        </a-menu-item>
        <a-menu-item key="mail-footer">
          {{ $t('NAVIGATOR.MAIL_FOOTER') }}
        </a-menu-item>
        <a-menu-item key="mail-content">
          {{ $t('NAVIGATOR.MAIL_CONTENT') }}
        </a-menu-item>
        <a-menu-item key="mail-activation">
          {{ $t('NAVIGATOR.MAIL_ACTIVATION') }}
        </a-menu-item>
      </a-sub-menu>
      <a-menu-item key="upgrade-tasks">
        <span>
          <clock-circle-outlined />
          <span>{{ $t('NAVIGATOR.UPGRADE_TASKS') }}</span>
        </span>
      </a-menu-item>
    </a-menu>
  </div>
</template>

<script lang='ts'>
import { defineComponent } from 'vue';
import { CloudOutlined, TeamOutlined, FolderOpenOutlined, UnorderedListOutlined, ClockCircleOutlined, MailOutlined, SearchOutlined } from '@ant-design/icons-vue';

export default defineComponent({
  name: 'Sidebar',
  components: {
    CloudOutlined,
    TeamOutlined,
    FolderOpenOutlined,
    UnorderedListOutlined,
    ClockCircleOutlined,
    MailOutlined,
    SearchOutlined
  },
  data () {
    return {
      current: [],
      openKeys: [],
      search: ''
    };
  },
  methods: {
    handleClick (e: Event) {
      console.log('click', e);
    },
    titleClick (e: Event) {
      console.log('titleClick', e);
    },
    onSearch () {
      console.log('search', this.search);
    }
  }
});
</script>

<style lang="less">
  @import '@/core/styles/variables';
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

        .ant-menu .ant-menu-item-selected {
          background: @light-blue;
        }
      }

      .ant-menu-submenu-title:hover,
      .ant-menu-submenu-title:focus,
      .ant-menu-submenu-title:active {
        background: @light-blue;
        span {
          color: @white;
        }
      }
    }
  }
</style>
