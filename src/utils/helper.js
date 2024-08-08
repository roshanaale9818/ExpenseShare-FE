// all the helper methods are here

// all the request options are here
export const StatusOptions = [
  {
    label: 'Any',
    value: 'Any',
  },
  {
    label: 'Pending',
    value: 'pending',
  },
  {
    label: 'Approved',
    value: 'approved',
  },
  {
    label: 'Rejected',
    value: 'rejected',
  },
];

export const SettlementStatus = {
  PENDING: 'PENDING',
  SETTLED: 'SETTLED',
  ACCEPTED: 'ACCEPTED',
  REJECTED: 'REJECTED',
};
export function getFormatedDate(date) {
  let res = '';
  try {
    if (!date) {
      res = 'Invalid date';
    }
    res = new Date(date).toISOString().split('T')[0];
    return res;
  } catch (error) {
    console.error(error);
    return 'Invalid date';
  }
}

export function stringToColor(string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

export function stringAvatar(name) {
  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: `${name.split(' ')[0][0].toUpperCase()}${name.split(' ')[1][0]}`,
  };
}
