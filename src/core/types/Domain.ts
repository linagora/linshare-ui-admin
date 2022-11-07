export default interface Domain {
  name: string;
  checked?: boolean;
  subs?: Domain[];
}
