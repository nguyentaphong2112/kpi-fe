import { Component, Input } from '@angular/core';
import { PopupService } from './popup.service';

@Component({
  selector: 'nz-modal-custom-approve-component',
  template: `
    <div class="main">
      <div class="title">
        <span>{{InputData?.title}}</span>
      </div>
      <div *ngIf="!InputData?.isNotShowBody" class="body">
        <p [innerHTML]="InputData?.contentBody"></p>
      </div>
      <div class="footer">
        <button nz-button nzType="primary" class="ok-approve" (click)="clickButton(true)">{{InputData.confirm ? InputData.confirm : 'Xác nhận' | translate}}</button>
        <button nz-button nzType="primary" class="cancel" (click)="clickButton(false)">{{InputData.cancel ? InputData.cancel : 'Hủy' | translate}}</button>
      </div>
    </div>
  `,
  styleUrls: ['./popup.custom.component.scss'],
})
export class ConfirmComponent {
  @Input() InputData: any;
  constructor(private popupService: PopupService) {
  }

  clickButton(value: boolean) {
    if (value) {
      this.popupService.modalDelete.triggerOk();
    } else {
      this.popupService.modalDelete.triggerCancel();
      this.popupService.modalDelete.destroy();
    }
  }
}
