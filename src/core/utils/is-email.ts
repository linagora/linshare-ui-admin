export function isEmail(string: string): boolean {
  const emailRegex = /^\S+@\S+\.\S+$/;

  return emailRegex.test(string);
}
