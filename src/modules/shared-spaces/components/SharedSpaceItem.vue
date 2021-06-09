<template>
  <div class="list-item">
    <a-list-item>
      <a-list-item-meta>
        <template #avatar>
          <component :is="data.nodeType === 'DRIVE' ? 'DriveIcon' : 'WorkgroupIcon'" fill="#0372B3"/>
        </template>

        <template #title>
          <span class="list-item__name">{{data.name}}</span>
          <span class="list-item__parent" v-if="data.parentName">@{{data.parentName}}</span>
        </template>

        <template #description>
          <span>{{ $t('GENERAL.UPDATE_TIME_RELATIVE', { time: relativeModificationDate })}}</span>
        </template>
      </a-list-item-meta>

      <template #extra>
        <a-tag class="list-item__node-type">{{
          $t(`SHARED_SPACES.NODE_TYPE.${data.nodeType}`)
        }}</a-tag>
      </template>
    </a-list-item>
  </div>
</template>

<script lang="ts">
import WorkgroupIcon from './WorkgroupIcon.vue';
import DriveIcon from './DriveIcon.vue';
import { defineComponent } from 'vue';
import useRelativeTime from '@/core/hooks/useRelativeTime';

export default defineComponent({
  name: 'SharedSpaceItem',
  components: {
    WorkgroupIcon,
    DriveIcon
  },
  props: {
    data: {
      type: Object,
      default: () => ({})
    }
  },
  setup (props) {
    return {
      relativeModificationDate: useRelativeTime(props.data.modificationDate)
    };
  }
});
</script>

<style lang='less' scoped>
  .list-item {
    border-bottom: 1px solid #EEE;
    background: #FFF;

    &__icon {
      width: 46px;
      color: #0372B3;
    }

    &__name {
      font-size: 16px;
      font-weight: 600;
    }

    &__parent {
      font-size: 15px;
      font-weight: 600;
      color: #0372B3;
      margin-left: 7px;
    }

    &__node-type {
      border: 0px;
      background: #EDF9FF;
      border-radius: 3px;
      color: #0372B3;
      padding: 7px;
      text-transform: uppercase;
    }
  }
</style>
