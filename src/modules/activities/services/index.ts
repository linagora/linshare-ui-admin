import api from '@/api';

async function getActivitiesLogs(
  domainUuid: string,
  beginDate: string | undefined,
  endDate: string | undefined,
  actions?: string,
  types?: string,
  domain?: string
) {
  const queryUrl = `domains/${domainUuid}/audit`;

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
