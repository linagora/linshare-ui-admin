import apiv4 from '@/apiv4';
import { UpgradeTask } from '../types/UpgradeTask';

async function getUpgradeTaskList(): Promise<UpgradeTask[]> {
  return await apiv4.get(`upgrade_tasks`);
}

export { getUpgradeTaskList };
