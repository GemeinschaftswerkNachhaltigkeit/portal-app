export function expired(item: { endUntil?: string }): boolean {
  if (!item.endUntil) {
    return false;
  }
  const currentDate = Date.now();
  const expireDate = new Date(item.endUntil).getTime();
  return currentDate > expireDate;
}
