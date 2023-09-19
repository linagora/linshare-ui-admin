export default interface Domain {
  name?: string;
  checked?: boolean;
  children?: Domain[];
  type?: string;
  uuid: string;
  label?: string;
  identifier?: string;
}
