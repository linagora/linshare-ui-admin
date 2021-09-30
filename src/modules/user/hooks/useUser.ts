import User from '../type/User';

export default function useUser (user: User) {
  let displayInfo;

  if (!user.firstName && !user.lastName) {
    displayInfo = user.mail;
  } else {
    displayInfo = `${user.firstName || ''} ${user.lastName || ''}`.trim();
  }

  return {
    displayInfo,
    firstLetter: displayInfo.charAt(0)
  };
}
