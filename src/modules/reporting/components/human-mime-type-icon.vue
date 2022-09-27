<script lang="ts" setup>
import ArchiveIcon from '@/core/components/icons/archive-icon.vue';
import MusicIcon from '@/core/components/icons/music-icon.vue';
import DocumentIcon from '@/core/components/icons/document-icon.vue';
import PictureIcon from '@/core/components/icons/picture-icon.vue';
import VideoIcon from '@/core/components/icons/video-icon.vue';
import SecurityIcon from '@/core/components/icons/security-icon.vue';
import TextIcon from '@/core/components/icons/text-icon.vue';
import FileIcon from '@/core/components/icons/file-icon.vue';

defineProps<{ type: string }>();
</script>

<template>
  <div class="icon" :class="type">
    <archive-icon v-if="type === 'archive'"></archive-icon>
    <music-icon v-else-if="type === 'audio'"></music-icon>
    <picture-icon v-else-if="type === 'image'"></picture-icon>
    <video-icon v-else-if="type === 'video'"></video-icon>
    <security-icon v-else-if="type === 'encrypted'"></security-icon>
    <text-icon v-else-if="type === 'text'"></text-icon>
    <document-icon v-else-if="type === 'document'"></document-icon>
    <file-icon v-else-if="type === 'pdf'"></file-icon>
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
  &.archive {
    color: #ea3c3c;
    background-color: #fbecec;
  }
  &.audio {
    color: #30cd60;
    background-color: #eafaef;
  }
  &.image {
    color: #ffa940;
    background-color: #fff6ec;
  }
  &.video {
    color: #ffa940;
    background-color: #fff6ec;
  }
  &.encrypted {
    color: #ff008a;
    background-color: #ffebf6;
  }
  &.text {
    color: #30cd60;
    background-color: #eafaef;
  }
  &.document {
    color: #007aff;
    background-color: #e8f4ff;
  }

  &.file {
    color: #007aff;
    background-color: #e8f4ff;
  }
  &.pdf {
    color: #007aff;
    background-color: #e8f4ff;
  }
  &.others {
    color: #007aff;
    background-color: #e8f4ff;
  }
}
</style>
