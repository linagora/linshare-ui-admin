import User from '../types/User';

export function getUserFullName (user: User) {
  return `${user.firstName || ''} ${user.lastName || ''}`;
}
