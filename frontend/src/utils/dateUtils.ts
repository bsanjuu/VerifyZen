export const parseDate = (dateStr: string): Date => {
  return new Date(dateStr);
};

export const getDurationInMonths = (
  startDate: string | Date,
  endDate: string | Date | null
): number => {
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : new Date();

  const years = end.getFullYear() - start.getFullYear();
  const months = end.getMonth() - start.getMonth();

  return years * 12 + months;
};

export const formatDuration = (months: number): string => {
  if (months < 12) {
    return months + ' month' + (months !== 1 ? 's' : '');
  }

  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;

  if (remainingMonths === 0) {
    return years + ' year' + (years !== 1 ? 's' : '');
  }

  return years + ' year' + (years !== 1 ? 's' : '') + ', ' + remainingMonths + ' month' + (remainingMonths !== 1 ? 's' : '');
};

export const isDateInFuture = (date: string | Date): boolean => {
  const d = new Date(date);
  const now = new Date();
  return d > now;
};

export const sortByDate = <T extends { startDate: string }>(
  items: T[],
  descending = true
): T[] => {
  return [...items].sort((a, b) => {
    const dateA = new Date(a.startDate).getTime();
    const dateB = new Date(b.startDate).getTime();
    return descending ? dateB - dateA : dateA - dateB;
  });
};

export const checkDateOverlap = (
  start1: string,
  end1: string | null,
  start2: string,
  end2: string | null
): boolean => {
  const s1 = new Date(start1);
  const e1 = end1 ? new Date(end1) : new Date();
  const s2 = new Date(start2);
  const e2 = end2 ? new Date(end2) : new Date();

  return s1 <= e2 && s2 <= e1;
};
