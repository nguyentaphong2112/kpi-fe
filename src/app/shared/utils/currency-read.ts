export class CurrencyRead {
  static numbTextArray = ['không', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín'];

  static currencyRead(numb) {
    if (numb === 0) {
      return this.numbTextArray[0];
    }
    let str = '';
    let temp = '';
    do {
      const billion = numb % 1000000000;
      numb = Math.floor(numb / 1000000000);
      if (numb > 0) {
        str = this.millionRead(billion, true) + temp + str;
      } else {
        str = this.millionRead(billion, false) + temp + str;
      }
      temp = ' tỷ';
    } while (numb > 0);
    const firstChar = str.trim().substring(0, 1);
    const textRead = firstChar.toUpperCase() + str.trim().substring(1);
    return textRead === '' ? textRead : textRead + ' đồng.';
  }

  static dozensRead(numb, full) {
    let str = '';
    const dozens = Math.floor(numb / 10);
    const unit = numb % 10;
    if (dozens > 1) {
      str = ' ' + this.numbTextArray[dozens] + ' mươi';
      if (unit === 1) {
        str += ' mốt';
      }
    } else if (dozens === 1) {
      str = ' mười';
      if (unit === 1) {
        str += ' một';
      }
    } else if (full && unit > 0) {
      str = ' lẻ';
    }
    if (unit === 5 && dozens >= 1) {
      str += ' lăm';
    } else if (unit > 1 || (unit === 1 && dozens === 0)) {
      str += ' ' + this.numbTextArray[unit];
    }
    return str;
  }

  static docblock(numb, full) {
    let str = '';
    const hundred = Math.floor(numb / 100);
    numb = numb % 100;
    if (full || hundred > 0) {
      str = ' ' + this.numbTextArray[hundred] + ' trăm';
      str += this.dozensRead(numb, true);
    } else {
      str = this.dozensRead(numb, false);
    }
    return str;
  }

  static millionRead(numb, full) {
    let str = '';
    const million = Math.floor(numb / 1000000);
    numb = numb % 1000000;
    if (million > 0) {
      str = this.docblock(million, full) + ' triệu';
      full = true;
    }
    const thousand = Math.floor(numb / 1000);
    numb = numb % 1000;
    if (thousand > 0) {
      str += this.docblock(thousand, full) + ' nghìn';
      full = true;
    }
    if (numb > 0) {
      str += this.docblock(numb, full);
    }
    return str;
  }
}


