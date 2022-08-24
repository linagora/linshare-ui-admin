import 'vue-router';

declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean;
    uiBeta?: boolean; // Use a different background color
  }
}
