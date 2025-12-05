import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'btn-action-by-id',
  templateUrl: './btn-action-by-id.component.html',
  styleUrls: ['./btn-action-by-id.component.scss']
})
export class BtnActionByIdComponent {
  @Input() disabledAll = false;
  @Input() disabledEdit = false;
  @Input() disabledApprove = false;
  @Input() disabledReject = false;
  @Input() disabledDelete = false;
  @Input() disabledLock = false;
  @Input() disabledUnlock = false;
  @Input() disableMenuModal = false;
  @Input() disableReset = false;
  @Input() disableAssignRole = false;
  @Input() showViewDetail = true;
  @Input() showEdit = true;
  @Input() showDelete = true;
  @Input() showApprove = false;
  @Input() showLock = false;
  @Input() showUnlock = false;
  @Input() showMenuModal = false;
  @Input() showReset = false;
  @Input() showAssignRole = false;
  @Output() doReject = new EventEmitter<number>();
  @Output() doViewDetail = new EventEmitter<number>();
  @Output() doEdit = new EventEmitter<number>();
  @Output() doApprove = new EventEmitter<number>();
  @Output() doDelete = new EventEmitter<number>();
  @Output() doLock = new EventEmitter<number>();
  @Output() doUnlock = new EventEmitter<number>();
  @Output() doMenuModal = new EventEmitter<number>();
  @Output() doReset = new EventEmitter<number>();
  @Output() doAssignRole = new EventEmitter<number>();

  constructor() {
  }

  approveById() {
    if (!this.disabledApprove) {
      this.doApprove.emit();
    }
  }

  openRejectById() {
    if (!this.disabledReject) {
      this.doReject.emit();
    }
  }

  deleteById() {
    if (!this.disabledDelete) {
      this.doDelete.emit();
    }
  }

  openViewDetail() {
    this.doViewDetail.emit();
  }

  openEdit() {
    if (!this.disabledEdit) {
      this.doEdit.emit();
    }
  }

  openlock() {
    if (!this.disabledLock) {
      this.doLock.emit();
    }
  }

  openUnlock() {
    if (!this.disabledUnlock) {
      this.doUnlock.emit();
    }
  }

  openMenuModal() {
    if (!this.disableMenuModal) {
      this.doMenuModal.emit();
    }
  }

  openReset() {
    if (!this.disableReset) {
      this.doReset.emit();
    }
  }

  openAssignRole() {
    if (!this.disableAssignRole) {
      this.doAssignRole.emit();
    }
  }
}
