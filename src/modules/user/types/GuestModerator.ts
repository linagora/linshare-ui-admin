export enum GUEST_MODERATOR_ROLE {
  ADMIN = 'ADMIN',
  SIMPLE = 'SIMPLE',
}

export default interface GuestModerator {
  uuid: string;
  role: GUEST_MODERATOR_ROLE;
  creationDate?: number;
  modificationDate?: number;
  account: {
    uuid: string;
    name?: string;
    email?: string;
  };
  guest: {
    uuid: string;
    name?: string;
    email?: string;
  };
}
