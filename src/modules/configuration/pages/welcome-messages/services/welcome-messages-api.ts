import api from '@/api';
import WelcomeMessage from '../types/WelcomeMessages';
import sanitizeWelcomeMessage from '../sanitize-welcome-message';

function sanitizeWelcomeMessageEntries(message: WelcomeMessage): WelcomeMessage {
  return {
    ...message,
    entries: Object.fromEntries(
      Object.entries(message.entries).map(([language, content]) => [language, sanitizeWelcomeMessage(content)])
    ),
  };
}

async function getWelcomeMessages(domainUuid: string): Promise<WelcomeMessage[]> {
  return await api.get(`domains/${domainUuid}/welcome_messages`);
}

async function getWelcomeMessage(domainUuid: string, messageUuid: string): Promise<WelcomeMessage> {
  return await api.get(`domains/${domainUuid}/welcome_messages/${messageUuid}`);
}

async function updateWelcomeMessage(domainUuid: string, message: WelcomeMessage): Promise<WelcomeMessage> {
  return await api.put(
    `domains/${domainUuid}/welcome_messages/${message.uuid}`,
    sanitizeWelcomeMessageEntries(message)
  );
}

async function createWelcomeMessage(domainUuid: string, message: WelcomeMessage): Promise<WelcomeMessage> {
  return await api.post(`domains/${domainUuid}/welcome_messages/`, sanitizeWelcomeMessageEntries(message));
}

async function deleteWelcomeMessage(domainUuid: string, messageUuid: string): Promise<WelcomeMessage> {
  return await api.delete(`domains/${domainUuid}/welcome_messages/${messageUuid}`, {
    data: {},
  });
}

async function assignWelcomeMessage(domainUuid: string, messageUuid: string): Promise<WelcomeMessage> {
  return await api.put(`domains/${domainUuid}/welcome_messages/${messageUuid}/assign`, {
    assign: true,
  });
}

export {
  getWelcomeMessages,
  getWelcomeMessage,
  updateWelcomeMessage,
  createWelcomeMessage,
  deleteWelcomeMessage,
  assignWelcomeMessage,
};
