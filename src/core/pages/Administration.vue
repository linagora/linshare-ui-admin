<template>
  <a-row>
    <a-col :md="{span: 16, offset: 4}">
      <div class="administration">
        <router-link to="/users/manage">
          <div class="administration__menu-item">
            <span>{{ $t("NAVIGATOR.MY_USERS")}}</span>
            <RightOutlined />
          </div>
        </router-link>
        <router-link to="/sharedspaces">
          <div class="administration__menu-item">
            <span>{{ $t("NAVIGATOR.MY_DRIVES_WORKGROUPS")}}</span>
            <RightOutlined />
          </div>
        </router-link>
        <div class="administration__menu-item">
          <span>{{ $t("NAVIGATOR.MY_CONTACT_LIST") }}</span>
          <RightOutlined />
        </div>
        <div class="administration__menu-item">
          <span>{{ $t("NAVIGATOR.INCONSISTENT_USERS") }}</span>
          <RightOutlined />
        </div>
        <div class="administration__menu-item">
          <span>{{ $t("NAVIGATOR.LOGGERS") }}</span>
          <RightOutlined />
        </div>
      </div>
    </a-col>
  </a-row>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { RightOutlined } from '@ant-design/icons-vue';

export default defineComponent({
  name: 'Administration',
  components: {
    RightOutlined
  }
});
</script>

<style lang='less' scoped>
  @import '@/assets/styles/variables';

  .administration {
    margin-top: 40px;

    &__menu-item {
      padding: 15px 0px;
      border-bottom: 1px solid #f0f0f0;
      display: flex;
      align-items: center;
      justify-content: space-between;

      span {
        font-size: 16px;
        color: #000;
      }

      .anticon {
        color: @light-blue;
        font-size: 14px;
      }
    }
  }
</style>
