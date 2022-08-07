import { ref, watch, Ref } from 'vue';
import { useRouter } from 'vue-router';

type UsableProfile = {
  current: Ref<string[]>;
  visible: Ref<boolean>;
  onClose: () => void;
  showDrawer: () => void;
};

export default function useProfile(): UsableProfile {
  const { currentRoute, push } = useRouter();
  const current = ref([currentRoute.value.path.split('/')[1]]);
  const visible = ref<boolean>(false);

  const showDrawer = () => {
    visible.value = true;
  };
  const onClose = () => {
    visible.value = false;
  };

  watch(currentRoute, (newRoute) => {
    current.value = [newRoute.path.split('/')[1]];
  });
  return {
    visible,
    showDrawer,
    onClose,
    current,
  };
}
