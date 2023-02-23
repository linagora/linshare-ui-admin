import apiv4 from '@/apiv4';

async function getActivitiesLogs(beginDate: string, endDate: string) {
  return await apiv4.get(`audit?beginDate=${beginDate}&endDate=${endDate}`);
}

export { getActivitiesLogs };
