function hasRepeatedDigits(value: string) {
  return /^(\d)\1+$/.test(value);
}

export function isValidCpf(value: string) {
  const cpf = value.replace(/\D/g, '');
  if (cpf.length !== 11 || hasRepeatedDigits(cpf)) return false;

  const calculateDigit = (length: number) => {
    let sum = 0;
    for (let index = 0; index < length; index += 1) sum += Number(cpf[index]) * (length + 1 - index);
    const remainder = (sum * 10) % 11;
    return remainder === 10 ? 0 : remainder;
  };

  return calculateDigit(9) === Number(cpf[9]) && calculateDigit(10) === Number(cpf[10]);
}

export function isValidCnpj(value: string) {
  const cnpj = value.replace(/\D/g, '');
  if (cnpj.length !== 14 || hasRepeatedDigits(cnpj)) return false;

  const calculateDigit = (baseLength: number) => {
    const weights = baseLength === 12
      ? [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
      : [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    const sum = weights.reduce((total, weight, index) => total + Number(cnpj[index]) * weight, 0);
    const remainder = sum % 11;
    return remainder < 2 ? 0 : 11 - remainder;
  };

  return calculateDigit(12) === Number(cnpj[12]) && calculateDigit(13) === Number(cnpj[13]);
}

export function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}
