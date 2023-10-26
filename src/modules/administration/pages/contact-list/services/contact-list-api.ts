import apiv4 from '@/apiv4';
import { Contact, ContactInfo, ContactListParameters } from '../types/Contact';
import Domain from '@/core/types/Domain';

async function getContactList(options: ContactListParameters = {}): Promise<Contact> {
  return await apiv4.get(`lists`, { params: options });
}

async function getContactListDetail(uuid: string): Promise<Contact> {
  return await apiv4.get(`lists/${uuid}`);
}

async function deleteContactList(payload: Contact): Promise<Contact> {
  return await apiv4.delete('lists/', { data: payload });
}
async function createContactList(payload: {
  accessPolicy: {
    rules: {
      type: 'ALLOW' | 'ALLOW_ALL' | 'DENY' | 'DENY_ALL';
      domain: Domain;
    }[];
  };
  label: string;
  description: string;
}) {
  return await apiv4.post(`lists`, payload);
}

async function updateContactList(payload: Contact) {
  return await apiv4.put(`lists`, payload);
}

async function addContactListEmail(uuid: string, payload: ContactInfo) {
  return await apiv4.post(`lists/${uuid}/contacts`, payload);
}

async function deleteContactListEmail(uuid: string, payload: ContactInfo | null) {
  return await apiv4.delete(`lists/${uuid}/contacts`, { data: payload });
}

export {
  getContactList,
  getContactListDetail,
  deleteContactList,
  createContactList,
  updateContactList,
  addContactListEmail,
  deleteContactListEmail,
};
