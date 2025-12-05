import { Component } from '@angular/core';
import { PopupService } from './popup.service';

@Component({
  selector: 'nz-modal-custom-component',
  template: `
    <div class="main">
      <img *ngIf="!isConfirm" alt='' src='assets/images/icon/popup-delete.svg'/>
      <span style="font-size: 40px; color: #fa5f5f" *ngIf="isConfirm" nz-icon nzType="redo" nzTheme="outline"></span>
      <div class="title">
        <span>{{title | translate}}</span>
      </div>
      <div class="footer">
        <button nz-button nzType="primary" class="cancel"
                (click)="clickButton(false)">{{'Hủy' | translate}}</button>
        <button *ngIf="!isConfirm" nz-button nzType="primary" class="ok"
                (click)="clickButton(true)">{{'Xóa' | translate}}</button>
        <button *ngIf="isConfirm" nz-button nzType="primary" class="ok"
                (click)="clickButton(true)">{{'Xác nhận' | translate}}</button>
      </div>
    </div>
  `,
  styleUrls: ['./popup.custom.component.scss']
})
export class DeletePopupComponent {
  constructor(private popupService: PopupService) {
  }

  title!: string;
  isConfirm: boolean;

  clickButton(value: boolean) {
    if (value) {
      this.popupService.modalDelete.triggerOk();
    } else {
      this.popupService.modalDelete.destroy();
    }
  }
}
