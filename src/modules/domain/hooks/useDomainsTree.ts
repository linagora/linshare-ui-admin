import { computed } from 'vue';
import { useStore } from 'vuex';

export default function useDomains () {
  const store = useStore();
  const domainsTree = computed(() => store.getters['Domain/getDomainsTree']);

  if (!domainsTree.value.uuid) {
    store.dispatch('Domain/fetchDomainsTree');
  }

  return {
    domainsTree
  };
}
