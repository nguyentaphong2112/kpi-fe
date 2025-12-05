import { EventEmitter, Injectable, OnDestroy } from '@angular/core';
import {ModalOptions, NzModalRef, NzModalService} from 'ng-zorro-antd/modal';
import { TranslateService } from '@ngx-translate/core';
import { DeletePopupComponent } from '@shared/component/popup/delete-popup-component';
import {ConfirmComponent} from "@shared/component/popup/confirm-popup-component";

@Injectable()
export class PopupService implements OnDestroy {
  onClick: EventEmitter<boolean> = new EventEmitter<boolean>();
  modalDelete: NzModalRef;
  title = this.translateService.instant('common.label.confirmDelete');
  isConfirm = false;

  constructor(private modal: NzModalService,
              private translateService: TranslateService) {
  }

  ngOnDestroy(): void {
    this.onClick.unsubscribe();
  }

  showModalConfirmDelete(onOK) {
    this.modalDelete = this.modal.create({
      nzTitle: null,
      nzStyle: {
        width: '414px',
        height: '321px',
      },
      nzWrapClassName: 'delete-popup-container',
      nzContent: DeletePopupComponent,
      nzComponentParams: {
        title: this.title,
        isConfirm: this.isConfirm
      },
      nzBodyStyle: {
        padding: '0px',
        border: 'none',
      },
      nzOnOk: onOK,
      nzFooter: null,
    });
    this.closeModal();
  }


  /*
  title: string
  isNotShowBody: string
  contentBody: string
  confirm: string
  cancel: string
  */
  showModalConfirm(onOk, data, nzOnCancel?){
    const init: ModalOptions = {
      nzTitle: null,
      nzStyle: {
        width: '414px',
        height: '223px',
      },
      nzWrapClassName: 'delete-popup-container',
      nzContent: ConfirmComponent,
      nzBodyStyle: {
        padding: '0px',
        border: 'none',
      },
      nzComponentParams: {
        InputData: data
      },
      nzOnOk: onOk,
      nzFooter: null,
    };

    if (nzOnCancel) {
      init.nzOnCancel = nzOnCancel;
    }


    this.modalDelete = this.modal.create(init);
  }

  closeModal() {
    this.modalDelete.afterClose.subscribe(() => {
      this.title = this.translateService.instant('common.label.confirmDelete');
      this.isConfirm = false;
    });
  }
}
