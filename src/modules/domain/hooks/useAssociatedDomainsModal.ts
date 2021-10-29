
import { reactive, ref, watchEffect } from 'vue';
import Domain from '../types/Domain';

export interface AssociatedDomainModalState {
  loading: boolean;
  visible: boolean;
  list: Domain[];
}

export default function useAssociatedDomainsModal (
  fetcher: (uuid: string) => Promise<Domain[]>
) {
  const targetUuid = ref('');
  const modal = reactive<AssociatedDomainModalState>({
    loading: false,
    visible: false,
    list: []
  });

  watchEffect(() => {
    if (!targetUuid.value) return;

    modal.loading = true;
    fetcher(targetUuid.value)
      .then(domains => {
        modal.list = domains;
      })
      .finally(() => {
        modal.loading = false;
      });
  });

  function show (uuid: string) {
    targetUuid.value = uuid;
    modal.visible = true;
  }

  function hide () {
    modal.visible = false;
  }

  return {
    hide,
    show,
    modal
  };
}
