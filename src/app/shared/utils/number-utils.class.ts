export class NumberUtils {
  static currencyFormat(value: any) {
    if (value) {
      value = value.toString();
      value = value.length > 1 ? value.replace(/^0+/, '') : value;
      return value.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
    }
    return null;
  }

  static convertCurrencyToNumber(value: any): number {
    if (value) {
      return Number(value.toString().replace(/,/g, ''));
    }
    return null;
  }

  static convertCurrencyToStringNumber(value: any): number {
    if (value) {
      return value.toString().replace(/,/g, '');
    }
    return null;
  }

  static convertCurrencyToNumberVN(value: any): number {
    if (value) {
      return Number(value.toString().split('.').join(''));
    }
    return null;
  }

  static currencyFormatVN(value: any) {
    if (value) {
      if (typeof value === 'string') {
        value = parseFloat(value);
      }
      value = value.toFixed(0).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1.');
      return value;
    }
    return value;
  }

  static numberFormatter(value) {
    if (value) {
      return Math.abs(Number(value)) >= 1.0e+9
        ? Math.abs(Number(value)) / 1.0e+9 + 'B'
        // Six Zeroes for Millions
        : Math.abs(Number(value)) >= 1.0e+6
          ? Math.abs(Number(value)) / 1.0e+6 + 'M'
          // Three Zeroes for Thousands
          : Math.abs(Number(value)) >= 1.0e+3
            ? Math.abs(Number(value)) / 1.0e+3 + 'K'
            : Math.abs(Number(value));
    }
    return value;
  }

  static millionFormatter(value) {
    if (value) {
      const millionValue = Math.abs(Number(value)) / 1.0e+6;
      return millionValue >= 1 ? millionValue : Math.round((millionValue + Number.EPSILON) * 100) / 100;
    }
    return value;
  }
}
