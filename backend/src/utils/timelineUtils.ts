import { DateRange, detectTimelineGaps, detectOverlaps } from './dateUtils';

export interface TimelineEntry {
  id: string;
  type: 'work' | 'education';
  title: string;
  organization: string;
  startDate: Date;
  endDate?: Date;
}

export interface TimelineAnalysis {
  totalGaps: number;
  totalOverlaps: number;
  gaps: Array<{
    start: Date;
    end: Date;
    durationInDays: number;
    severity: 'low' | 'medium' | 'high';
  }>;
  overlaps: Array<{
    entry1: TimelineEntry;
    entry2: TimelineEntry;
    overlapInDays: number;
    severity: 'low' | 'medium' | 'high';
  }>;
  riskScore: number;
  flags: string[];
}

function calculateGapSeverity(durationInDays: number): 'low' | 'medium' | 'high' {
  if (durationInDays < 60) return 'low';
  if (durationInDays < 180) return 'medium';
  return 'high';
}

function calculateOverlapSeverity(durationInDays: number): 'low' | 'medium' | 'high' {
  if (durationInDays < 30) return 'low';
  if (durationInDays < 90) return 'medium';
  return 'high';
}

export function analyzeTimeline(entries: TimelineEntry[]): TimelineAnalysis {
  const dateRanges: DateRange[] = entries.map((entry) => ({
    start: entry.startDate,
    end: entry.endDate,
  }));

  const rawGaps = detectTimelineGaps(dateRanges);
  const rawOverlaps = detectOverlaps(dateRanges);

  const gaps = rawGaps.map((gap) => ({
    ...gap,
    severity: calculateGapSeverity(gap.durationInDays),
  }));

  const overlaps = rawOverlaps.map((overlap) => {
    const entry1 = entries.find(
      (e) => e.startDate === overlap.range1.start
    )!;
    const entry2 = entries.find(
      (e) => e.startDate === overlap.range2.start
    )!;

    return {
      entry1,
      entry2,
      overlapInDays: overlap.overlapInDays,
      severity: calculateOverlapSeverity(overlap.overlapInDays),
    };
  });

  const flags: string[] = [];
  let riskScore = 0;

  // Analyze gaps
  const significantGaps = gaps.filter((g) => g.severity !== 'low');
  if (significantGaps.length > 0) {
    flags.push(`Found ${significantGaps.length} significant timeline gap(s)`);
    riskScore += significantGaps.length * 15;
  }

  // Analyze overlaps
  const significantOverlaps = overlaps.filter((o) => o.severity !== 'low');
  if (significantOverlaps.length > 0) {
    flags.push(`Found ${significantOverlaps.length} suspicious overlapping position(s)`);
    riskScore += significantOverlaps.length * 25;
  }

  // Check for unusual patterns
  const workEntries = entries.filter((e) => e.type === 'work');
  if (workEntries.length > 10) {
    flags.push('Unusually high number of positions');
    riskScore += 10;
  }

  const shortTenures = workEntries.filter((e) => {
    const endDate = e.endDate || new Date();
    const months = (endDate.getTime() - e.startDate.getTime()) / (1000 * 60 * 60 * 24 * 30);
    return months < 6;
  });

  if (shortTenures.length > 3) {
    flags.push('Multiple short-tenure positions (< 6 months)');
    riskScore += 15;
  }

  // Cap risk score at 100
  riskScore = Math.min(riskScore, 100);

  return {
    totalGaps: gaps.length,
    totalOverlaps: overlaps.length,
    gaps,
    overlaps,
    riskScore,
    flags,
  };
}

export function generateTimelineReport(analysis: TimelineAnalysis): string {
  let report = '# Timeline Analysis Report\n\n';

  report += `**Risk Score:** ${analysis.riskScore}/100\n\n`;

  if (analysis.flags.length > 0) {
    report += '## Red Flags\n';
    analysis.flags.forEach((flag) => {
      report += `- ${flag}\n`;
    });
    report += '\n';
  }

  if (analysis.gaps.length > 0) {
    report += '## Timeline Gaps\n';
    analysis.gaps.forEach((gap, index) => {
      report += `${index + 1}. Gap of ${gap.durationInDays} days (${gap.severity} severity)\n`;
      report += `   From ${gap.start.toISOString().split('T')[0]} to ${gap.end.toISOString().split('T')[0]}\n`;
    });
    report += '\n';
  }

  if (analysis.overlaps.length > 0) {
    report += '## Overlapping Positions\n';
    analysis.overlaps.forEach((overlap, index) => {
      report += `${index + 1}. ${overlap.entry1.title} at ${overlap.entry1.organization} overlaps with\n`;
      report += `   ${overlap.entry2.title} at ${overlap.entry2.organization}\n`;
      report += `   Overlap: ${overlap.overlapInDays} days (${overlap.severity} severity)\n`;
    });
    report += '\n';
  }

  if (analysis.flags.length === 0 && analysis.gaps.length === 0 && analysis.overlaps.length === 0) {
    report += '## No Issues Found\n';
    report += 'The timeline appears consistent with no significant gaps or overlaps.\n';
  }

  return report;
}
