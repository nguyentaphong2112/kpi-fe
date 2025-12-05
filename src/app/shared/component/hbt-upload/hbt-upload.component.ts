import { AfterContentInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, Renderer2, SimpleChanges } from '@angular/core';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';
import {NzUploadFile} from 'ng-zorro-antd/upload';
import {InputBoolean} from 'ng-zorro-antd/core/util';
import {FileService} from './file.service';
import { finalize } from 'rxjs';

export class ModelUpload {
  type?: 'default' | 'warning' | 'error' | 'success' = 'default';
  labelText?: string;
  textMessageValue?: string;
  showIcon = true;
  description = '';
  disable?: boolean;
  autofocus?: 'autofocus' | null; // Chưa hoạt động
  showFlexEnd = true;
  showError = false;
  multiple = true;
  viewDetail = false;
  viewDetailStr = '';
  loadMore = false;
}

export class EmitData {
  fileList: NzUploadFile[];
  docIdsDelete?: number[];
}

@Component({
  selector: 'hbt-upload',
  templateUrl: './hbt-upload.component.html',
  styleUrls: ['./hbt-upload.component.scss'],
})
export class HbtUploadComponent implements OnInit, OnChanges {

  constructor(private toastrService: ToastrService,
              private translate: TranslateService,
              private fileService: FileService,
              private renderer: Renderer2
  ) {
  }
  @Input() config: ModelUpload = new ModelUpload();
  @Input() labelText: string;
  @Input() typeUpload: 'drag' | 'upload' | 'icon' = 'upload';
  @Input() descriptionText = '';
  @Input() @InputBoolean() required = false;
  @Input() typeFileAvailable?: Array<string> = ['docx', 'doc', 'xlsx', 'xls', 'pdf', 'dwg', 'jpg', 'png', 'jpeg', 'svg', 'zip', 'json', 'epub'];
  @Input() showContentAlert = false;
  @Input() maxFile = 100;
  @Input() maxSize = 300;
  @Input() showFlexEnd = false;
  @Input() icon = 'inbox';
  @Input() type: 'default' | 'warning' | 'error' | 'success';
  @Input() @InputBoolean() disable = false;
  @Input() showIconMessage = true;
  @Input() showError = false;
  @Input() multiple = true;
  @Input() objInfoImage: { width: number, height: number} | undefined = undefined;
  @Output() validateWidthHeightImg = new EventEmitter<boolean>(false);

  @Input() isDownloadFileWithNoSecurity = false;
  @Input() url = '/v1/attachment-file/download/{attachmentId}/{checksum}';
  @Input() serviceName: string;
  @Input() fileList: NzUploadFile[] = [];
  @Output() fileListChange = new EventEmitter<NzUploadFile[]>();
  @Input() docIdsDelete: number[] = [];
  @Output() docIdsDeleteChange = new EventEmitter<number[]>();
  @Output() onFileChangeAction?: EventEmitter<EmitData> = new EventEmitter();
  isShowError: boolean;
  private isDownload = false;

  inputGroupClass = 'input__group';
  inputGroupGroupClass = 'input__group--group';
  inputTextClass = 'input__text';
  inputMessageClass = 'input__message';

  classGroup = {
    noIcon: 'input__group--no-icon',
    icon: 'input__group--icon'
  };

  classGroupGroup = {
    default: 'input__group--group--default',
    warning: 'input__group--group--warning',
    error: 'input__group--group--error',
    success: 'input__group--group--success',
  };

  classInput = {
    default: 'input__text--default',
    warning: 'input__text--warning',
    error: 'input__text--error',
    success: 'input__text--success'
  };

  classMessage = {
    default: 'input__message--default',
    warning: 'input__message--warning',
    error: 'input__message--error',
    success: 'input__message--success'
  };

  classIcon = {
    warning: 'warning',
    error: 'close-circle',
    success: 'check-circle',
  };

  iconType: string;

  private isAddAction = false;

  ngOnInit(): void {
    if (!this.fileList) {
      this.fileList = [];
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.checkShowError();
    setTimeout(() => {
      if (!this.isAddAction) {
        const listRef =  document.getElementsByClassName('ant-upload-list-item-done ant-upload-list-item-list-type-text');
        for (const element of listRef as any) {
          // ant-upload-list-item-name
          this.isAddAction = true;
          this.renderer.listen(element, 'click', () => {
            this.handleEventFile(element);
          });
        }
      }
    }, 50);
  }

  private handleEventFile(element: Element) {
    const btns = element.getElementsByClassName('ant-btn ant-upload-list-item-card-actions-btn ant-btn-text ant-btn-sm ant-btn-icon-only');
    (btns[0] as any).click();
  }

  checkShowError() {
    if ((this.showError && this.required) && (this.fileList && this.fileList.length === 0)) {
      this.type = 'error';
      this.setErrorMessage(this.translate.instant('File bắt buộc nhập'));
    } else {
      this.type = 'default';
    }
    this.inputGroupClass = 'input__group' + ' ';
    this.inputGroupGroupClass = 'input__group--group' + ' ';
    this.inputTextClass = 'input__text' + ' ';
    this.inputMessageClass = 'input__message ' + ' ';
    this.setConfig();
    this.configInput();
  }

  setConfig() {
    if (!this.showFlexEnd) {
      this.config.showFlexEnd = this.showFlexEnd;
    }
    if (this.type) {
      this.config.type = this.type;
    }
    if (this.labelText) {
      this.config.labelText = this.labelText;
    }
    if (this.descriptionText) {
      this.config.description = this.descriptionText;
    }
    this.config.disable = this.disable;
    this.config.showError = this.showError;
    this.config.showIcon = this.showIconMessage;
    this.config.multiple = this.multiple;
  }

  configInput() {
    this.inputGroupClass += this.classGroup.noIcon;
    switch (this.config?.type) {
      case 'default':
        this.inputGroupGroupClass += this.classGroupGroup.default;
        this.inputTextClass += this.classInput.default;
        this.inputMessageClass += this.classMessage.default;
        break;
      case 'warning':
        this.inputGroupGroupClass += this.classGroupGroup.warning;
        this.inputTextClass += this.classInput.warning;
        this.inputMessageClass += this.classMessage.warning;
        this.iconType = this.classIcon.warning;
        break;
      case 'error':
        this.inputGroupGroupClass += this.classGroupGroup.error;
        this.inputTextClass += this.classInput.error;
        this.inputMessageClass += this.classMessage.error;
        this.iconType = this.classIcon.error;
        break;
      case 'success':
        this.inputGroupGroupClass += this.classGroupGroup.success;
        this.inputTextClass += this.classInput.success;
        this.inputMessageClass += this.classMessage.success;
        this.iconType = this.classIcon.success;
        break;
      default:
        this.inputGroupGroupClass += this.classGroupGroup.default;
        this.inputTextClass += this.classInput.default;
        this.inputMessageClass += this.classMessage.default;
        break;
    }
  }

  setErrorMessage(errorDescription: string) {
    this.config.textMessageValue = errorDescription;
  }

  public getListAccept(): string {
    return this.typeFileAvailable.map(item => '.' + item).join(', ');
  }

  beforeUpload = (file: NzUploadFile): boolean => {
    if (file.size > 0) {
      this.isShowError = false;
      this.setErrorMessage(null);
      if (this.checkFileExists(file, this.fileList)) {
        let fileUploadIsAvailable: NzUploadFile;
        if (!file.type && file.name) {
          const tempArr = file.name.split('.');
          const ext = tempArr[tempArr.length - 1];
          if (this.typeFileAvailable.includes(ext.toLowerCase())) {
            fileUploadIsAvailable = file;
          }
        }
        if (file.type && this.checkFileUploadIsAvailable(file.type)) {
          this.showContentAlert = false;
          fileUploadIsAvailable = file;
        } else {
          this.showContentAlert = true;
          if (this.typeUpload === 'upload') {
            this.isShowError = true;
            this.setErrorMessage(this.getTypeFileAvailable());
          }
        }
        if (fileUploadIsAvailable) {
          if (this.maxFile === 1) {
            if (!this.checkSizeAvailable(fileUploadIsAvailable)) {
              if (this.fileList[0]?.uid) {
                this.docIdsDeleteChange.emit([this.fileList[0].uid as any]);
              }
              this.fileList = [fileUploadIsAvailable];
              this.fileListChange.emit(this.fileList);
              this.onFileChangeAction.emit({fileList: this.fileList});
              this.checkShowError();
            } else {
              this.isShowError = true;
              this.setErrorMessage(this.translate.instant('Dung lượng file không quá: ') + this.maxSize + 'MB');
            }
          } else {
            let tempListFileOld = Array.isArray(this.fileList) ? Array.from(this.fileList) : [];
            if (this.maxFile >= tempListFileOld.length + 1) {
              if (!this.checkSizeAvailable(fileUploadIsAvailable)) {
                tempListFileOld = [
                  ...tempListFileOld,
                  fileUploadIsAvailable
                ];
                this.fileList = tempListFileOld;
                this.fileListChange.emit(this.fileList);
                this.onFileChangeAction.emit({fileList: this.fileList, docIdsDelete: this.docIdsDelete});
                this.checkShowError();
              } else {
                this.isShowError = true;
                this.setErrorMessage(this.translate.instant('Dung lượng file không quá: ') + this.maxSize + 'MB');
              }
            } else {
              this.isShowError = true;
              this.setErrorMessage(this.translate.instant('Số lượng file không được quá: ') + this.maxFile);
            }
          }
        }
      } else {
        this.isShowError = true;
        this.setErrorMessage(this.translate.instant('File đã được tải lên: ') + file.name);
      }
      // check size image

      if (this.objInfoImage){
        if (['jpg', 'png', 'jpeg'].some(el => el === file?.type?.split('/')[1])) {
          const img = new Image();
          const fileBlob = file as any;
          img.src = URL.createObjectURL(fileBlob);
          img.onload = async () => {
            if ((img.width <= this.objInfoImage?.width && img.height <= this.objInfoImage?.height) && !this.checkSizeAvailable(file)){
              this.checkShowError();
              // this.showError
              this.validateWidthHeightImg.emit(true);
            }else {
              this.validateWidthHeightImg.emit(false);
              this.isShowError = true;
              this.setErrorMessage(this.translate.instant('Ảnh tải lên vượt quá kích thước quy định. Hãy chọn lại'));
              return;
            }
          };
        }}
    }
    return false;
  }

  private checkSizeAvailable(itemFile: NzUploadFile) {
    return itemFile.size >= this.maxSize * 1024 * 1024;
  }

  private checkFileUploadIsAvailable(fileType: string) {
    const ext = getTypeFileUpload(fileType);
    return Array.isArray(this.typeFileAvailable) && this.typeFileAvailable.includes(ext);
  }

  private checkFileExists(fileInput: any, listFileResponse: Array<any>) {
    if (!listFileResponse || (Array.isArray(listFileResponse) && listFileResponse.length === 0)) {
      return true;
    }
    if (Array.isArray(listFileResponse)) {
      const res = listFileResponse.filter((item) => item.name === fileInput.name);
      if (res.length > 0) {
        return false;
      }
    }
    return true;
  }

  public getTypeFileAvailable() {
    return this.translate.instant('Định dạng hỗ trợ: ') + this.typeFileAvailable.join(', ') + ` không quá ${this.maxSize} MB`;
  }

  downloadFile = (file: NzUploadFile) => {
    if (file && !this.isDownload) {
      this.isDownload = true;
      const url = this.url.replace('{attachmentId}', file.uid).replace('{checksum}', file.checkSum);
      this.fileService.doDownloadAttachFileWithSecurity(url, null, this.serviceName).pipe(finalize(() => this.isDownload = false)).subscribe();
    }
  }

  removeFile = (file: NzUploadFile) => {
    this.isShowError = false;
    this.setErrorMessage(null);
    this.docIdsDelete.push(Number(file.uid));
    const index = this.fileList.indexOf(file);
    this.fileList.splice(index, 1);
    this.fileListChange.emit(this.fileList);
    this.onFileChangeAction.emit({ fileList: this.fileList, docIdsDelete: this.docIdsDelete });
    if (Number(file.uid)) {
      this.docIdsDeleteChange.emit(this.docIdsDelete);
    }
    this.checkShowError();
    return true;
  }
}

export function getTypeFileUpload(typeFile: string) {
  let ext;
  switch (typeFile) {
    case TYPE_FILE_UPLOAD.DOC:
      ext = 'doc';
      break;
    case TYPE_FILE_UPLOAD.DOCX:
      ext = 'docx';
      break;
    case  TYPE_FILE_UPLOAD.XLS:
      ext = 'xls';
      break;
    case TYPE_FILE_UPLOAD.XLSX:
      ext = 'xlsx';
      break;
    case TYPE_FILE_UPLOAD.PDF:
      ext = 'pdf';
      break;
    case TYPE_FILE_UPLOAD.DWG:
      ext = 'dwg';
      break;
    case TYPE_FILE_UPLOAD.EXE:
      ext = 'exe';
      break;
    case TYPE_FILE_UPLOAD.PNG:
      ext = 'png';
      break;
    case TYPE_FILE_UPLOAD.JPEG:
      ext = 'jpeg';
      break;
    case TYPE_FILE_UPLOAD.ZIP:
      ext = 'zip';
      break;
    case TYPE_FILE_UPLOAD.ZIP_NZ:
      ext = 'zip';
      break;
    case TYPE_FILE_UPLOAD.AVI:
      ext = 'avi';
      break;
    case TYPE_FILE_UPLOAD.FLV:
      ext = 'flv';
      break;
    case TYPE_FILE_UPLOAD.WMV:
      ext = 'wmv';
      break;
    case TYPE_FILE_UPLOAD.MOV:
      ext = 'mov';
      break;
    case TYPE_FILE_UPLOAD.MP4:
      ext = 'mp4';
      break;
    case TYPE_FILE_UPLOAD.SVG:
      ext = 'svg';
      break;
    case TYPE_FILE_UPLOAD.RAR:
      ext = 'rar';
      break;
    case TYPE_FILE_UPLOAD.JSON:
      ext = 'json';
      break;
    case TYPE_FILE_UPLOAD.EPUB || TYPE_FILE_UPLOAD.EPUB_ZIP:
      ext = 'epub';
      break;
    default:
      ext = undefined;
      break;
  }
  return ext;
}

export function getTypeFileDownload(typeFile: string) {
  let ext;
  switch (typeFile) {
    case 'doc':
      ext = TYPE_FILE_UPLOAD.DOC;
      break;
    case 'docx':
      ext = TYPE_FILE_UPLOAD.DOCX;
      break;
    case 'xls':
      ext = TYPE_FILE_UPLOAD.XLS;
      break;
    case 'xlsx':
      ext = TYPE_FILE_UPLOAD.XLSX;
      break;
    case 'pdf':
      ext = TYPE_FILE_UPLOAD.PDF;
      break;
    case 'dwg':
      ext = TYPE_FILE_UPLOAD.DWG;
      break;
    case 'exe':
      ext = TYPE_FILE_UPLOAD.EXE;
      break;
    case 'epub':
      ext = TYPE_FILE_UPLOAD.EPUB;
      break;
    case 'png':
      ext = TYPE_FILE_UPLOAD.PNG;
      break;
    case 'jpg':
    case 'jpeg':
      ext = TYPE_FILE_UPLOAD.JPEG;
      break;
    case 'zip':
      ext = TYPE_FILE_UPLOAD.ZIP;
      break;
    case 'avi':
      ext = TYPE_FILE_UPLOAD.AVI;
      break;
    case 'flv':
      ext = TYPE_FILE_UPLOAD.FLV;
      break;
    case 'wmv':
      ext = TYPE_FILE_UPLOAD.WMV;
      break;
    case 'mov':
      ext = TYPE_FILE_UPLOAD.MOV;
      break;
    case 'mp4':
      ext = TYPE_FILE_UPLOAD.MP4;
      break;
    case 'svg':
      ext = TYPE_FILE_UPLOAD.SVG;
      break;
    case 'rar':
      ext = TYPE_FILE_UPLOAD.RAR;
      break;
    case 'json':
      ext = TYPE_FILE_UPLOAD.JSON;
      break;
    default:
      ext = undefined;
      break;
  }
  return ext;
}

export const TYPE_FILE_UPLOAD = {
  XLSX: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  XLS: 'application/vnd.ms-excel',
  PDF: 'application/pdf',
  DOC: 'application/msword',
  DOCX: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  DWG: 'application/dwg',
  JSON: 'application/json',
  EXE: 'application/x-msdownload',
  EPUB: 'application/epub+zip',
  EPUB_ZIP: 'application/epub+zip',
  PNG: 'image/png',
  JPEG: 'image/jpeg',
  ZIP: 'application/x-zip-compressed',
  ZIP_NZ: 'application/zip',
  AVI: 'video/avi',
  FLV: 'video/flv',
  WMV: 'video/x-ms-wmv',
  MOV: 'video/quicktime',
  MP4: 'video/mp4',
  SVG: 'image/svg+xml',
  RAR: 'application/x-rar-compressed',
};
