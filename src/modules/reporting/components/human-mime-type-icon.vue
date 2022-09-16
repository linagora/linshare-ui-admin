<script lang="ts" setup>
import ArchiveIcon from '@/core/components/icons/archive-icon.vue';
import MusicIcon from '@/core/components/icons/music-icon.vue';
import DocumentIcon from '@/core/components/icons/document-icon.vue';
import PictureIcon from '@/core/components/icons/picture-icon.vue';
import VideoIcon from '@/core/components/icons/video-icon.vue';
import SecurityIcon from '@/core/components/icons/security-icon.vue';
import TextIcon from '@/core/components/icons/text-icon.vue';
import FileIcon from '@/core/components/icons/file-icon.vue';
import { HUMAN_MIME_TYPE_COLOR } from '../constants/human-mime-type-color';

defineProps<{ type: string }>();

function lightenColor(color: string, percent: number) {
  const num = parseInt(color.replace('#', ''), 16),
    amt = Math.round(2.55 * percent),
    R = (num >> 16) + amt,
    B = ((num >> 8) & 0x00ff) + amt,
    G = (num & 0x0000ff) + amt;

  return (
    '#' +
    (
      0x1000000 +
      (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
      (B < 255 ? (B < 1 ? 0 : B) : 255) * 0x100 +
      (G < 255 ? (G < 1 ? 0 : G) : 255)
    )
      .toString(16)
      .slice(1)
  );
}
</script>

<template>
  <div class="icon">
    <archive-icon v-if="type === 'archive'"></archive-icon>
    <music-icon v-else-if="type === 'audio'"></music-icon>
    <picture-icon v-else-if="type === 'image'"></picture-icon>
    <video-icon v-else-if="type === 'video'"></video-icon>
    <security-icon v-else-if="type === 'encrypted'"></security-icon>
    <text-icon v-else-if="type === 'text'"></text-icon>
    <document-icon v-else-if="type === 'document'"></document-icon>
    <file-icon v-else></file-icon>
  </div>
</template>

<style lang="less" scoped>
.icon {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 48px;
  height: 48px;
  border-radius: 100%;
  color: v-bind('HUMAN_MIME_TYPE_COLOR[type]');
  background-color: v-bind('lightenColor(HUMAN_MIME_TYPE_COLOR[type], 60)');
}
</style>
