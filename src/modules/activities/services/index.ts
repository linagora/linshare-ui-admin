import api from '@/api';

async function getActivitiesLogs(
  beginDate: string | undefined,
  endDate: string | undefined,
  actions?: string,
  types?: string,
  domain?: string
) {
  const queryUrl = `domains/LinShareRootDomain/audit`;

  return await api.get(queryUrl, {
    params: {
      beginDate,
      endDate,
      actions,
      types,
      domain,
    },
  });
}

export { getActivitiesLogs };
