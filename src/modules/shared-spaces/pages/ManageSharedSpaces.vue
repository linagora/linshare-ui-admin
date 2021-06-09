<template>
  <PageTitle
    :title="$t('SHARED_SPACES.MANAGE_SHARED_SPACES.TITLE')"
    :breadcrumbs="breadcrumbs"
  >
    <template #helperContent>
      <div class='alert-message-in-description'>{{ $t('SHARED_SPACES.MANAGE_SHARED_SPACES.TITLE') }}</div>
      <div>{{ $t('SHARED_SPACES.MANAGE_SHARED_SPACES.DESCRIPTION') }}</div>
    </template>

  </PageTitle>

  <SharedSpacesList />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useRoute } from 'vue-router';
import PageTitle from '@/core/components/PageTitle.vue';
import SharedSpacesList from '@/modules/shared-spaces/components/SharedSpacesList.vue';

export default defineComponent({
  name: 'ManageSharedSpaces',
  components: {
    SharedSpacesList,
    PageTitle
  },
  setup () {
    const { meta } = useRoute();
    const breadcrumbs = meta && meta.parent && meta.parentName
      ? [{
        key: meta.parent,
        label: meta.parentName
      }] : [];

    return {
      breadcrumbs
    };
  }
});
</script>
