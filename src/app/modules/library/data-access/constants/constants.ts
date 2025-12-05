export class Constant {
  public static readonly BOOK_TYPES = [
    { value: 'SACH_IN', label: 'library.books.label.photoBook' },
    { value: 'SACH_DIEN_TU', label: 'library.books.label.eBook' },
    { value: 'IN_VA_DIEN_TU', label: 'library.books.label.photoBookAndeBook' },
  ];
  public static readonly STATUS = [
    { value: 'HIEN_CO', label: 'library.details.label.availableStatus' },
    { value: 'DANG_MUON', label: 'library.details.label.borrowStatus' },
    { value: 'DA_MAT', label: 'library.details.label.lostStatus' }
  ];
}
