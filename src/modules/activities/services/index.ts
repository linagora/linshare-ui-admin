import apiv4 from '@/apiv4';

async function getActivitiesLogs(
  beginDate: string | undefined,
  endDate: string | undefined,
  actions?: string,
  types?: string
) {
  let queryUrl = `audit?beginDate=${beginDate}&endDate=${endDate}`;
  queryUrl = actions ? `${queryUrl}&action=${actions}` : queryUrl;
  queryUrl = types ? `${queryUrl}&type=${types}` : queryUrl;

  return await apiv4.get(queryUrl);
}

export { getActivitiesLogs };
