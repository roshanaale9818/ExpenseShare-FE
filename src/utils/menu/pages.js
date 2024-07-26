const PAGES = [
  { name: 'Home', url: '/home', icon: '' },
  { name: 'About Us', url: '/aboutus', icon: '' },
  { name: 'Login', url: '/login', icon: '' },
  { name: 'Contact', url: '/contact', icon: '' },
];

const SETTINGS_MENU = [
  { title: 'Profile', url: '/auth/profile', icon: '' },
  { title: 'Account', url: '/home', icon: '' },
  { title: 'Dashboard', url: '/auth', icon: '' },
];

// expense status with the value for listing
const EXPENSE_STATUS = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'settled', label: 'Settled' },
  { value: 'rejected', label: 'Rejected' },
];

export { PAGES, SETTINGS_MENU, EXPENSE_STATUS };
