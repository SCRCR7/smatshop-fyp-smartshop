// Reusable date/time formatting utilities
export function toDate(input) {
  if (!input) return null;
  const d = input instanceof Date ? input : new Date(input);
  if (Number.isNaN(d.getTime())) return null;
  return d;
}

export function formatMonthYear(input) {
  const d = toDate(input || new Date());
  if (!d) return '';
  return new Intl.DateTimeFormat(undefined, { month: 'short', year: 'numeric' }).format(d);
}

export function formatMonthDay(input) {
  const d = toDate(input || new Date());
  if (!d) return '';
  const opts = { month: 'short', day: 'numeric' };
  // include year if not current year
  if (d.getFullYear() !== new Date().getFullYear()) opts.year = 'numeric';
  return new Intl.DateTimeFormat(undefined, opts).format(d);
}

export function formatTime(input) {
  const d = toDate(input || new Date());
  if (!d) return '';
  return new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit' }).format(d);
}

export function isSameDay(a, b) {
  const da = toDate(a);
  const db = toDate(b);
  if (!da || !db) return false;
  return da.getFullYear() === db.getFullYear() && da.getMonth() === db.getMonth() && da.getDate() === db.getDate();
}

// Formats a date to a friendly relative label with time, e.g. "Today, 12:45 AM" or "Jan 12, 12:45 AM"
export function formatRelativeWithTime(input, nowInput) {
  const d = toDate(input || new Date());
  const now = toDate(nowInput || new Date());
  if (!d) return '';
  if (isSameDay(d, now)) {
    return `Today, ${formatTime(d)}`;
  }
  // For same year, show month+day; otherwise include year
  const opts = { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' };
  if (d.getFullYear() !== now.getFullYear()) opts.year = 'numeric';
  return new Intl.DateTimeFormat(undefined, opts).format(d);
}

export default {
  toDate,
  formatMonthYear,
  formatMonthDay,
  formatTime,
  isSameDay,
  formatRelativeWithTime,
};
