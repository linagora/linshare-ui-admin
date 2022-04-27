import api from '@/api';
import GuestModerator from '../types/GuestModerator';

async function listGuestModerators(guestUuid: string): Promise<GuestModerator[]> {
  return await api.get(`guests/${guestUuid}/moderators`);
}

async function createGuestModerator(guestUuid: string, moderator: GuestModerator): Promise<GuestModerator> {
  return await api.post(`guests/${guestUuid}/moderators`, moderator);
}

async function removeGuestModerator(guestUuid: string, moderator: GuestModerator): Promise<GuestModerator> {
  return await api.delete(`guests/${guestUuid}/moderators/${moderator.uuid}`, { data: moderator });
}

async function updateGuestModerator(guestUuid: string, moderator: GuestModerator): Promise<GuestModerator> {
  return await api.put(`guests/${guestUuid}/moderators/${moderator.uuid}`, moderator);
}

export { createGuestModerator, listGuestModerators, removeGuestModerator, updateGuestModerator };
