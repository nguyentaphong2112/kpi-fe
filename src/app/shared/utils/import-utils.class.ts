export function getTypeExport(format: string): string {
  let type: string;
  switch (format) {
    case 'xls':
      type = 'application/vnd.ms-excel';
      break;
    case 'xlsx':
      type = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      break;
    case 'pdf':
      type = 'application/pdf';
      break;
    case 'docx':
      type = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      break;
    default:
      type = null;
      break;
  }
  return type;
}
