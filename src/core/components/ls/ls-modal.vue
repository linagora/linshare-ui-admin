<template>
  <a-modal class="ls-modal" v-bind="$attrs">
    <slot v-for="slot in Object.keys($slots)" :name="slot" />
  </a-modal>
</template>
