export function handleModalContent(transactionType: string) {
  if (transactionType === 'create') {
    return {
      title: 'Nova Transação',
      buttonText: 'Salvar',
    };
  }

  return {
    title: 'Editar Transação',
    buttonText: 'Editar',
  };
}

export const MoneyFormatInput = (value: any) => {
  function reverse(bla: any) {
    return bla.split('').reverse().join('');
  }

  const valor = reverse(value.value.replace(/[^\d]+/gi, ''));
  let resultado = '';
  const mascara = reverse('##.###.###,##');
  for (let x = 0, y = 0; x < mascara.length && y < valor.length; ) {
    if (mascara.charAt(x) !== '#') {
      resultado += mascara.charAt(x);
      x++;
    } else {
      resultado += valor.charAt(y);
      y++;
      x++;
    }
  }
  return reverse(resultado);
};
