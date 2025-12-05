export class CatalogModel {
  value: number | string;
  label: string;
  dateOfBirth?: string;

  constructor(label, value, dateOfBirth?) {
    this.value = value;
    this.label = label;
    this.dateOfBirth = dateOfBirth;
  }
}
