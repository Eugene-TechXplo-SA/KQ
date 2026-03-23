export function buildIdempotencyKey(prefix: string, id: string): string {
  return `${prefix}:${id}`;
}
