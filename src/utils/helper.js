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
