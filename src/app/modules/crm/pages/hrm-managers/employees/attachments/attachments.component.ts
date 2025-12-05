import { Component, OnInit } from '@angular/core';
import { BaseFormComponent } from '@core/components/base-form.component';
import { Validators } from '@angular/forms';
import { SelectModal } from '@shared/component/hbt-select/select.component';

@Component({
  selector: 'app-attachments',
  templateUrl: './attachments.component.html',
  styleUrls: ['./attachments.component.scss']
})
export class AttachmentsComponent extends BaseFormComponent<any> implements OnInit {

  override initForm() {
    this.form = this.fb.group({
      attachmentTypeName: [null],
      attachmentType: [null, [Validators.required]],
      attachFileList: [null, [Validators.required]],
    });
  }

  override save() {
    this.isSubmitted = true;
    if (this.form.invalid) {
      return;
    }
    this.modalRef.close(this.form.value);
  }

  selectAttachmentType(data: SelectModal) {
    this.f['attachmentTypeName'].setValue(data?.itemSelected?.name);
  }
}


