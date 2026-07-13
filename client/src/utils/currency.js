// Central place to control currency formatting across the whole app.
// Change the `currency` and `locale` here to switch currencies everywhere at once.
const formatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export const formatCurrency = (amount) => formatter.format(amount || 0);
