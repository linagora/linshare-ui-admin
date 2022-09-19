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
