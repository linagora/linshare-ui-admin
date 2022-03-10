import User from '../types/User';

export function getUserFullName(user: User): string {
  return `${user.firstName || ''} ${user.lastName || ''}`;
}
