import { ref } from 'vue';

const actions = ref<
  {
    class: string;
    action: () => void;
    loading?: boolean;
    label: string;
    icon?: any;
  }[]
>([]);

export default function useUpgradeTaskPage() {
  function setActions(
    items: {
      class: string;
      label: string;
      icon?: any;
      action: () => void;
    }[]
  ) {
    actions.value = items;
  }

  function addActions(
    items: {
      class: string;
      label: string;
      icon?: any;
      action: () => void;
    }[]
  ) {
    actions.value.push(...items);
  }

  return {
    actions,
    setActions,
    addActions,
  };
}
