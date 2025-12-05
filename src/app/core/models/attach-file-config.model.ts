export class AttachFileConfig {
  required: boolean;
  maxSize: number;
  fileTypes: string[];

  constructor(
    required: boolean = false,
    maxSize: number = 3,
    fileTypes: string[] = ['jpg', 'png', 'gif', 'bmp', 'tiff', 'svg', 'txt', 'doc', 'pdf', 'odt', 'rtf', 'md', 'doc', 'docx', 'csv', 'ppt', 'pptx', 'mp3', 'mp4', 'zip', 'rar', 'tar', '7z', 'gz']
  ) {
    this.required = required;
    this.maxSize = maxSize;
    this.fileTypes = fileTypes;
  }
}