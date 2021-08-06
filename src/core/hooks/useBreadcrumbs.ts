import { useRoute, useRouter } from 'vue-router';

interface Breadcrumb {
  label: string | unknown;
  path: string;
}

export default function useBreadcrumbs () {
  const { meta, path } = useRoute();
  const { getRoutes } = useRouter();
  const breadcrumbs: Breadcrumb[] = [{
    label: meta.label,
    path
  }];

  function addParentRoute (name: string | unknown) {
    const parent = getRoutes().find(route => route.name === name);

    if (parent) {
      breadcrumbs.unshift({
        label: parent.meta.label,
        path: parent.path
      });

      if (parent.meta.parentRoute) {
        addParentRoute(parent.meta.parentRoute);
      }
    }
  }

  if (meta.parentRoute) {
    addParentRoute(meta.parentRoute);
  }

  return {
    breadcrumbs
  };
}
