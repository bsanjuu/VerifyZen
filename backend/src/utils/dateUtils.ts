import { parseISO, differenceInDays, differenceInMonths, isValid, format } from 'date-fns';

export interface DateRange {
  start: Date;
  end?: Date;
}

export function parseDateString(dateStr: string): Date | null {
  try {
    const date = parseISO(dateStr);
    return isValid(date) ? date : null;
  } catch {
    return null;
  }
}

export function calculateDuration(startDate: Date, endDate?: Date): number {
  const end = endDate || new Date();
  return differenceInMonths(end, startDate);
}

export function calculateDurationInDays(startDate: Date, endDate?: Date): number {
  const end = endDate || new Date();
  return differenceInDays(end, startDate);
}

export function formatDateRange(startDate: Date, endDate?: Date): string {
  const start = format(startDate, 'MMM yyyy');
  const end = endDate ? format(endDate, 'MMM yyyy') : 'Present';
  return `${start} - ${end}`;
}

export function detectTimelineGaps(ranges: DateRange[]): Array<{
  start: Date;
  end: Date;
  durationInDays: number;
}> {
  const sortedRanges = ranges.sort((a, b) => a.start.getTime() - b.start.getTime());
  const gaps: Array<{ start: Date; end: Date; durationInDays: number }> = [];

  for (let i = 0; i < sortedRanges.length - 1; i++) {
    const currentEnd = sortedRanges[i].end || new Date();
    const nextStart = sortedRanges[i + 1].start;

    const gapInDays = differenceInDays(nextStart, currentEnd);

    // Only consider gaps of 30+ days as significant
    if (gapInDays >= 30) {
      gaps.push({
        start: currentEnd,
        end: nextStart,
        durationInDays: gapInDays,
      });
    }
  }

  return gaps;
}

export function detectOverlaps(ranges: DateRange[]): Array<{
  range1: DateRange;
  range2: DateRange;
  overlapInDays: number;
}> {
  const overlaps: Array<{ range1: DateRange; range2: DateRange; overlapInDays: number }> = [];

  for (let i = 0; i < ranges.length; i++) {
    for (let j = i + 1; j < ranges.length; j++) {
      const range1End = ranges[i].end || new Date();
      const range2End = ranges[j].end || new Date();

      const overlapStart = Math.max(
        ranges[i].start.getTime(),
        ranges[j].start.getTime()
      );
      const overlapEnd = Math.min(range1End.getTime(), range2End.getTime());

      if (overlapStart < overlapEnd) {
        const overlapInDays = differenceInDays(
          new Date(overlapEnd),
          new Date(overlapStart)
        );

        overlaps.push({
          range1: ranges[i],
          range2: ranges[j],
          overlapInDays,
        });
      }
    }
  }

  return overlaps;
}

export function isDateInRange(date: Date, range: DateRange): boolean {
  const end = range.end || new Date();
  return date >= range.start && date <= end;
}

export function validateDateRange(start: string, end?: string): boolean {
  const startDate = parseDateString(start);
  if (!startDate) return false;

  if (end) {
    const endDate = parseDateString(end);
    if (!endDate) return false;
    return startDate <= endDate;
  }

  return true;
}
