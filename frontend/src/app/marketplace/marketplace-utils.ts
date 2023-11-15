import { DateTime } from 'luxon';

export function expired(item: { endUntil?: string }): boolean {
  if (!item.endUntil) {
    return false;
  }
  const currentDate = Date.now();
  const expireDate = DateTime.fromISO(item.endUntil)
    .plus({ days: 1 })
    .toMillis();
  return currentDate > expireDate;
}
