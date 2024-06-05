import Domain from '@/modules/domain/types/Domain';
import dayjs, { Dayjs } from 'dayjs';
import { defineStore } from 'pinia';
import { DEFAULT_PAGE_SIZE } from '@/core/constants/pagination';

export enum ACTIVITIES_TYPE {
  SHARE_ENTRY = 'SHARE_ENTRY',
  DOCUMENT_ENTRY = 'DOCUMENT_ENTRY',
  GUEST = 'GUEST',
  WORK_SPACE = 'WORK_SPACE',
  WORK_SPACE_MEMBER = 'WORK_SPACE_MEMBER',
  WORK_GROUP = 'WORK_GROUP',
  WORKGROUP_MEMBER = 'WORKGROUP_MEMBER',
  WORKGROUP_FOLDER = 'WORKGROUP_FOLDER',
  WORKGROUP_DOCUMENT = 'WORKGROUP_DOCUMENT',
  WORKGROUP_DOCUMENT_REVISION = 'WORKGROUP_DOCUMENT_REVISION',
  DOMAIN = 'DOMAIN',
  USER = 'USER',
  DOMAIN_PATTERN = 'DOMAIN_PATTERN',
  GROUP_FILTER = 'GROUP_FILTER',
  WORKSPACE_FILTER = 'WORKSPACE_FILTER',
  FUNCTIONALITY = 'FUNCTIONALITY',
  CONTACTS_LISTS = 'CONTACTS_LISTS',
  CONTACTS_LISTS_CONTACTS = 'CONTACTS_LISTS_CONTACTS',
  UPLOAD_REQUEST_GROUP = 'UPLOAD_REQUEST_GROUP',
  UPLOAD_REQUEST = 'UPLOAD_REQUEST',
  UPLOAD_REQUEST_URL = 'UPLOAD_REQUEST_URL',
  UPLOAD_REQUEST_ENTRY = 'UPLOAD_REQUEST_ENTRY',
  UPLOAD_PROPOSITION = 'UPLOAD_PROPOSITION',
  ANONYMOUS_SHARE_ENTRY = 'ANONYMOUS_SHARE_ENTRY',
  AUTHENTICATION = 'AUTHENTICATION',
  USER_PREFERENCE = 'USER_PREFERENCE',
  RESET_PASSWORD = 'RESET_PASSWORD',
  SAFE_DETAIL = 'SAFE_DETAIL',
  PUBLIC_KEY = 'PUBLIC_KEY',
  JWT_PERMANENT_TOKEN = 'JWT_PERMANENT_TOKEN',
  SHARED_SPACE_NODE = 'SHARED_SPACE_NODE',
  MAIL_ATTACHMENT = 'MAIL_ATTACHMENT',
  SHARED_SPACE_MEMBER = 'SHARED_SPACE_MEMBER',
  DRIVE_MEMBER = 'DRIVE_MEMBER',
  DRIVE = 'DRIVE',
  WORKGROUP = 'WORKGROUP',
  GUEST_MODERATOR = 'GUEST_MODERATOR',
  GUEST_CONVERTING = 'GUEST_CONVERTING',
}

export enum ACTIVITIES_ACTION {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  GET = 'GET',
  DOWNLOAD = 'DOWNLOAD',
  SUCCESS = 'SUCCESS',
  FAILURE = 'FAILURE',
  PURGE = 'PURGE',
  CONVERT = 'CONVERT',
}

export type ActivitiesAction = keyof typeof ACTIVITIES_ACTION;

export type ActivitiesType = keyof typeof ACTIVITIES_TYPE;
interface ActivitiesStore {
  action: ActivitiesAction[];
  type: ActivitiesType[];
  beginDate: Dayjs | null;
  endDate: Dayjs | null;
  domain: string[];
  actorEmail: string[];
  resourceName: string[];
}

const defaultState = {
  beginDate: dayjs().subtract(7, 'days'),
  endDate: dayjs(),
  action: [],
  type: [],
  domain: [],
  actorEmail: [],
  resourceName: [],
};
export const useActivitiesStore = defineStore('activitiesStore', {
  state: (): ActivitiesStore => ({
    beginDate: dayjs().subtract(7, 'days'),
    endDate: dayjs(),
    action: [],
    type: [],
    domain: [],
    actorEmail: [],
    resourceName: [],
  }),
  getters: {
    isDefaultFilter: (state) => {
      return (
        state?.action?.length == 0 &&
        state?.type?.length == 0 &&
        state?.domain?.length == 0 &&
        state?.actorEmail?.length == 0 &&
        state?.resourceName?.length == 0 &&
        dayjs().isSame(state?.endDate, 'day') &&
        dayjs().subtract(7, 'days').isSame(state?.beginDate, 'days')
      );
    },
  },
});
