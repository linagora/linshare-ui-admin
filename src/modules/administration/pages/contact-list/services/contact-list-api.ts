import apiv4 from '@/apiv4';
import api from '@/api';
import { Contact } from '../types/Contact';
import Domain from '@/core/types/Domain';

async function getContactList(): Promise<Contact[]> {
  return await apiv4.get(`lists`);
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
  return await apiv4.put(`mail_contents`, payload);
}

export { getContactList, getContactListDetail, deleteContactList, createContactList, updateContactList };
