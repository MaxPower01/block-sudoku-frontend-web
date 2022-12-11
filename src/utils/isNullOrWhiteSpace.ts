export default function isNullOrWhiteSpace(str: any): boolean {
  return typeof str !== "string" || str.trim().length === 0;
}
