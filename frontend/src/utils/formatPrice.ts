const currencyFormatter = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN',
})

export function formatPrice(amount: number): string {
  return currencyFormatter.format(amount)
}