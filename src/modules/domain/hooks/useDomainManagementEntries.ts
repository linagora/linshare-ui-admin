import { computed } from 'vue';
import { useStore } from 'vuex';
import { RouteLocationRaw } from 'vue-router';
import { DOMAIN_TYPE } from '@/modules/domain/type/Domain';
import { RemoteServersRoute } from '@/modules/remote-server/router';

interface DomainManagementEntry {
  title: string;
  route?: RouteLocationRaw;
  usedFor?: DOMAIN_TYPE[];
}

const DOMAIN_MANAGEMENT_ENTRIES: DomainManagementEntry[] = [
  {
    title: 'NAVIGATOR.DETAILS',
    route: { name: 'DomainDetails' }
  },
  {
    title: 'NAVIGATOR.REMOTE_SERVERS',
    usedFor: [DOMAIN_TYPE.ROOT],
    route: { name: RemoteServersRoute.name }
  },
  {
    title: 'NAVIGATOR.PROVIDERS',
    usedFor: [DOMAIN_TYPE.TOP, DOMAIN_TYPE.SUB]
  },
  {
    title: 'NAVIGATOR.REMOTE_FILTERS',
    usedFor: [DOMAIN_TYPE.ROOT, DOMAIN_TYPE.TOP, DOMAIN_TYPE.SUB]
  },
  {
    title: 'NAVIGATOR.PARAMETERS'
  },
  {
    title: 'NAVIGATOR.TYPE_MIME'
  },
  {
    title: 'NAVIGATOR.WELCOME_MESSAGES'
  },
  {
    title: 'NAVIGATOR.TYPE_MIME'
  },
  {
    title: 'NAVIGATOR.QUOTA'
  },
  {
    title: 'NAVIGATOR.PUBLIC_KEYS'
  }
];

export default function useDomainManagementEntries () {
  const store = useStore();

  const entries = computed(() => {
    const currentDomain = store.getters['Domain/getCurrentDomain'];

    return DOMAIN_MANAGEMENT_ENTRIES.filter(entry => !entry.usedFor || entry.usedFor.includes(currentDomain.type));
  });

  return {
    entries
  };
}
