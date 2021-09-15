import { computed } from 'vue';
import { useStore } from 'vuex';
import { useRoute, LocationAsRelativeRaw } from 'vue-router';
import { DOMAIN_TYPE } from '@/modules/domain/type/Domain';
import { RemoteServersRoute } from '@/modules/remote-server/router';

interface DomainManagementEntry {
  title: string;
  route?: LocationAsRelativeRaw;
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
  const { name: currentRouteName } = useRoute();

  const entries = computed(() => {
    const currentDomain = store.getters['Domain/getCurrentDomain'];

    return DOMAIN_MANAGEMENT_ENTRIES.filter(entry => !entry.usedFor || entry.usedFor.includes(currentDomain.type));
  });

  const availableForCurrentDomain = computed(() => {
    const entry = DOMAIN_MANAGEMENT_ENTRIES.find(entry => entry.route?.name === currentRouteName);
    const currentDomain = store.getters['Domain/getCurrentDomain'];

    if (!entry || !entry.usedFor) {
      return true;
    }

    return entry.usedFor.includes(currentDomain.type);
  });

  return {
    availableForCurrentDomain,
    entries
  };
}
