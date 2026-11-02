export function parseTimeToMinutes(timeStr: string): number {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + (minutes || 0);
}

export function formatMinutesToTime(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60) % 24;
  const minutes = totalMinutes % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

export function getCurrentTimeMinutes(): number {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
}

export function calculateEventProgress(startTime: string, endTime: string): { progress: number; isActive: boolean; isPast: boolean } {
  const nowMin = getCurrentTimeMinutes();
  const startMin = parseTimeToMinutes(startTime);
  const endMin = parseTimeToMinutes(endTime);

  if (nowMin < startMin) {
    return { progress: 0, isActive: false, isPast: false };
  }
  if (nowMin >= endMin) {
    return { progress: 100, isActive: false, isPast: true };
  }

  const totalDuration = endMin - startMin;
  const elapsed = nowMin - startMin;
  const progress = Math.min(100, Math.max(0, Math.round((elapsed / totalDuration) * 100)));

  return { progress, isActive: true, isPast: false };
}

