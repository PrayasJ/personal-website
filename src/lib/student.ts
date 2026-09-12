export function cgpaToPercentage(cgpa: number, multiplier = 9.5): number {
  if (!Number.isFinite(cgpa) || cgpa < 0) {
    throw new Error("CGPA must be a non-negative number.");
  }
  if (!Number.isFinite(multiplier) || multiplier <= 0) {
    throw new Error("Multiplier must be a positive number.");
  }
  return cgpa * multiplier;
}

export type AttendanceInput = {
  attended: number;
  total: number;
  targetPercent: number;
};

export type AttendanceResult = {
  currentPercent: number;
  canMiss: number | null;
  needToAttend: number | null;
};

export function calculateAttendance(input: AttendanceInput): AttendanceResult {
  const { attended, total, targetPercent } = input;
  if (![attended, total, targetPercent].every(Number.isFinite)) {
    throw new Error("Enter valid numbers.");
  }
  if (attended < 0 || total < 0) {
    throw new Error("Counts cannot be negative.");
  }
  if (attended > total) {
    throw new Error("Attended cannot exceed total held.");
  }
  if (targetPercent <= 0 || targetPercent > 100) {
    throw new Error("Target % must be between 0 and 100.");
  }

  const currentPercent = total === 0 ? 0 : (attended / total) * 100;
  const target = targetPercent / 100;

  let canMiss: number | null = null;
  if (currentPercent >= targetPercent && total > 0) {
    // Max missable m such that attended / (total + m) >= target
    canMiss = Math.floor(attended / target - total);
    if (canMiss < 0) {
      canMiss = 0;
    }
  } else if (total === 0) {
    canMiss = null;
  } else {
    canMiss = 0;
  }

  let needToAttend: number | null = null;
  if (currentPercent >= targetPercent) {
    needToAttend = 0;
  } else if (target >= 1) {
    needToAttend = null;
  } else {
    // Find smallest n >= 0: (attended + n) / (total + n) >= target
    const n = Math.ceil((target * total - attended) / (1 - target));
    needToAttend = Math.max(0, n);
  }

  return { currentPercent, canMiss, needToAttend };
}

export type AgeParts = {
  years: number;
  months: number;
  days: number;
  totalDays: number;
};

function daysInMonth(year: number, monthIndex: number): number {
  return new Date(year, monthIndex + 1, 0).getDate();
}

/** Exact calendar age from birth date to as-of date (inclusive of completed units). */
export function calculateAge(birth: Date, asOf: Date = new Date()): AgeParts {
  if (Number.isNaN(birth.getTime()) || Number.isNaN(asOf.getTime())) {
    throw new Error("Enter a valid date.");
  }
  if (asOf < birth) {
    throw new Error("As-of date cannot be before date of birth.");
  }

  let years = asOf.getFullYear() - birth.getFullYear();
  let months = asOf.getMonth() - birth.getMonth();
  let days = asOf.getDate() - birth.getDate();

  if (days < 0) {
    months -= 1;
    const prevMonth = asOf.getMonth() === 0 ? 11 : asOf.getMonth() - 1;
    const prevYear =
      asOf.getMonth() === 0 ? asOf.getFullYear() - 1 : asOf.getFullYear();
    days += daysInMonth(prevYear, prevMonth);
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  const ms = asOf.getTime() - birth.getTime();
  const totalDays = Math.floor(ms / (24 * 60 * 60 * 1000));

  return { years, months, days, totalDays };
}

export function parseLocalDate(value: string): Date {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
  if (!match) {
    throw new Error("Use YYYY-MM-DD.");
  }
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(year, month - 1, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    throw new Error("Invalid calendar date.");
  }
  return date;
}
