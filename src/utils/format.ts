export function formatDate(date: string) {
  const splittedDate = date.split('-');

  return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`;
}

export function formatCurrency(value: string | number): string {
  const signal = Number(value) < 0 ? '-' : '';

  value = String(value).replace(/\D/g, '');

  let formatValue = Number(value) / 100;

  const currency = formatValue.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

  return signal + currency;
}
