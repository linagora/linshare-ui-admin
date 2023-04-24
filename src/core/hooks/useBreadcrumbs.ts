import { useRouter } from 'vue-router';
import { computed, ComputedRef } from 'vue';
interface Breadcrumb {
  label: string;
  path: string;
  disableAction?: boolean;
}

type UsableBreadcrumbs = {
  breadcrumbs: ComputedRef<Breadcrumb[]>;
};

export default function useBreadcrumbs(customs?: Breadcrumb[]): UsableBreadcrumbs {
  const { getRoutes, currentRoute } = useRouter();
  const breadcrumbs = computed<Breadcrumb[]>(() => {
    const list: Breadcrumb[] = [
      {
        label: currentRoute.value.meta.label as string,
        path: currentRoute.value.name as string,
        disableAction: !!currentRoute.value.meta.disableAction,
      },
    ];

    if (currentRoute.value.meta.parentRoute) {
      addParentRoute(currentRoute.value.meta.parentRoute, list);
    }

    if (customs) {
      list.forEach((breadcrumb) => {
        const toBeUpdate = customs.find((custom) => custom.path === breadcrumb.path);

        if (toBeUpdate) {
          breadcrumb.label = toBeUpdate.label;
        }
      });
    }

    return list;
  });

  function addParentRoute(name: string | unknown, list: Breadcrumb[]) {
    const parent = getRoutes().find((route) => route.name === name);

    if (parent) {
      list.unshift({
        label: parent.meta.label as string,
        path: parent.name as string,
      });

      if (parent.meta.parentRoute) {
        addParentRoute(parent.meta.parentRoute, list);
      }
    }
  }

  return {
    breadcrumbs,
  };
}
