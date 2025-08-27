export function humanize(str: string): string {
  return str
    .split(/-|_/g)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
