import { format, getTime, formatDistanceToNow } from 'date-fns';

// ----------------------------------------------------------------------

export function fDate(date, newFormat) {
  const fm = newFormat || 'dd MMM yyyy';

  return date ? format(new Date(date), fm) : '';
}

export function fDateTime(date, newFormat) {
  const fm = newFormat || 'dd MMM yyyy p';

  return date ? format(new Date(date), fm) : '';
}

export function fTimestamp(date) {
  return date ? getTime(new Date(date)) : '';
}

export function fToNow(date) {
  return date
    ? formatDistanceToNow(new Date(date), {
        addSuffix: true,
      })
    : '';
}

export function formatDateString(dateString) {
  try {
    // Check if the input is a valid ISO date string
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) {
      throw new Error('Invalid date format');
    }

    // Format options for a readable date and time
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    };

    // Convert to local date and time format
    return date.toLocaleString('en-US', options);
  } catch (error) {
    // Handle invalid date format
    console.error('Error:', error.message);
    return 'Invalid date format';
  }
}
