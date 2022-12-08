export default interface WelcomeMessage {
  uuid: string;
  creationDate?: number;
  name: string;
  modificationDate?: number;
  description?: string;
  domain?: {
    uuid: string;
    name: string;
  };
  entries: Record<string, string>;
  assignedToCurrentDomain?: boolean;
  readOnly?: boolean;
}

export const EMPTY_WELCOME_MESSAGE: WelcomeMessage = {
  uuid: '',
  name: '',
  entries: {
    VIETNAMESE: '',
    ENGLISH: '',
    FRENCH: '',
    RUSSIAN: '',
  },
};
