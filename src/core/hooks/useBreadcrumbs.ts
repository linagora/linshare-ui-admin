import { useRouter } from 'vue-router';
import { computed } from 'vue';

interface Breadcrumb {
  label: string | unknown;
  path: string;
}

export default function useBreadcrumbs () {
  const { getRoutes, currentRoute } = useRouter();
  const breadcrumbs = computed<Breadcrumb[]>(() => {
    const list = [{
      label: currentRoute.value.meta.label,
      path: currentRoute.value.name as string
    }];

    if (currentRoute.value.meta.parentRoute) {
      addParentRoute(currentRoute.value.meta.parentRoute, list);
    }

    return list;
  });

  function addParentRoute (name: string | unknown, list: Breadcrumb[]) {
    const parent = getRoutes().find(route => route.name === name);

    if (parent) {
      list.unshift({
        label: parent.meta.label,
        path: parent.name as string
      });

      if (parent.meta.parentRoute) {
        addParentRoute(parent.meta.parentRoute, list);
      }
    }
  }

  return {
    breadcrumbs
  };
}
