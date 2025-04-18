import {formatDistanceToNow} from 'date-fns';

export const formatISOToCustom = (isoString: string) => {
  const date = new Date(isoString);

  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  const seconds = String(date.getUTCSeconds()).padStart(2, '0');

  const day = date.getUTCDate();
  const month = months[date.getUTCMonth()];
  const year = date.getUTCFullYear();

  return `${hours}:${minutes}:${seconds} ${day} ${month}, ${year}`;
};

interface FirestoreTimestamp {
  _seconds: number;
  _nanoseconds: number;
}

export const formatFirestoreTimestamp = (
  timestamp: FirestoreTimestamp,
): string => {
  try {
    const milliseconds =
      timestamp._seconds * 1000 + timestamp._nanoseconds / 1000000;
    const date = new Date(milliseconds);
    return formatDistanceToNow(date, {addSuffix: true});
  } catch (error) {
    console.error('Error formatting timestamp:', error);
    return 'recently';
  }
};

export const calculateAge = (dob: string): number => {
  try {
    const trimmedDob = dob.trim();
    if (!/^(\d{2})\/(\d{2})\/(\d{4})$/.test(trimmedDob)) {
      throw new Error("Invalid date format. Expected 'DD/MM/YYYY'.");
    }

    const [day, month, year] = trimmedDob.split('/').map(Number);
    if (day < 1 || day > 31 || month < 1 || month > 12 || year < 0) {
      throw new Error('Invalid date parts. Check the day, month, and year.');
    }
    const dobDate = new Date(year, month - 1, day);
    if (isNaN(dobDate.getTime())) {
      throw new Error('Invalid date object creation.');
    }
    const today = new Date();
    let age = today.getFullYear() - dobDate.getFullYear();
    const hasBirthdayPassedThisYear =
      today.getMonth() > dobDate.getMonth() ||
      (today.getMonth() === dobDate.getMonth() &&
        today.getDate() >= dobDate.getDate());

    if (!hasBirthdayPassedThisYear) {
      age -= 1;
    }
    return age;
  } catch (error: any) {
    return NaN;
  }
};
