import { EventEmitter, Injectable, OnDestroy } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { PreviewFileComponent } from '@shared/component/preview-file/preview-file.component';

@Injectable({
  providedIn: 'root'
})
export class PreviewFileService implements OnDestroy {
  onClick: EventEmitter<boolean> = new EventEmitter<boolean>();
  modalRef: NzModalRef;

  constructor(private modal: NzModalService) {
  }

  ngOnDestroy(): void {
    this.onClick.unsubscribe();
  }

  showModalViewFile(serviceName: string, data: any, fileName: string, isPdf: boolean, isImage: boolean) {
    this.modalRef = this.modal.create({
      // nzTitle: fileName.substring(0, fileName.lastIndexOf('.')),
      nzTitle: fileName,
      nzStyle: {
        width: (window.innerWidth * 0.9) + 'px',
        height: 'auto'
      },
      nzWrapClassName: 'preview-file',
      nzContent: PreviewFileComponent,
      nzComponentParams: {
        serviceName,
        data,
        fileName,
        isPdf,
        isImage
      },
      nzBodyStyle: {
        padding: '30px',
        border: 'none'
      }
    });
  }
}
