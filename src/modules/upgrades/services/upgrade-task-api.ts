import apiv4 from '@/apiv4';
import { UpgradeTask, ConsoleInfos } from '../types/UpgradeTask';

async function getUpgradeTaskList(): Promise<UpgradeTask[]> {
  return await apiv4.get(`upgrade_tasks`);
}
async function getUpgradeTaskDetail(uuid: string): Promise<UpgradeTask[]> {
  return await apiv4.get(`upgrade_tasks/${uuid}/async_tasks`);
}

async function upgradeTaskRetry(taskIdentifier: string): Promise<UpgradeTask> {
  return await apiv4.put(`upgrade_tasks/${taskIdentifier}?force=true`);
}

async function getConsoleInformations(
  taskIdentifier: string | string[],
  uuid: string | string[]
): Promise<ConsoleInfos[]> {
  return await apiv4.get(`upgrade_tasks/${taskIdentifier}/async_tasks/${uuid}/console`);
}

export { getUpgradeTaskList, getUpgradeTaskDetail, getConsoleInformations, upgradeTaskRetry };
