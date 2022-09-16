export interface MimeTypeStatistic {
  uuid: string;
  value: number;
  totalSize: number;
  domainUuid: string;
  type: 'DAILY';
  mimeType: string;
  humanMimeType: HumanMimeType;
  creationDate: number;
  statisticDate: number;
}

export type HumanMimeType =
  | 'audio'
  | 'video'
  | 'text'
  | 'image'
  | 'pdf'
  | 'archive'
  | 'encrypted'
  | 'document'
  | 'others';

export type StatisticByHumanMimeType = Record<
  HumanMimeType,
  {
    totalSize: number;
    totalCount: number;
  }
>;

export type StatisticByMimeType = Record<
  string,
  {
    humanMimeType: HumanMimeType;
    totalSize: number;
    totalCount: number;
  }
>;

export const EMPTY_STATISTIC: StatisticByHumanMimeType = {
  audio: { totalSize: 0, totalCount: 0 },
  archive: { totalSize: 0, totalCount: 0 },
  document: { totalSize: 0, totalCount: 0 },
  encrypted: { totalSize: 0, totalCount: 0 },
  image: { totalSize: 0, totalCount: 0 },
  pdf: { totalSize: 0, totalCount: 0 },
  text: { totalSize: 0, totalCount: 0 },
  video: { totalSize: 0, totalCount: 0 },
  others: { totalSize: 0, totalCount: 0 },
};
