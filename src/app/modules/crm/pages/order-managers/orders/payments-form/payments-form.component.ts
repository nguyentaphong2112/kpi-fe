import { Component, Injector, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { PaymentsModel } from '../../../../data-access/models/order-managers/payments.model';
import { PaymentsService } from '../../../../data-access/services/order-managers/payments.service';
import { BaseFormComponent } from '@core/components/base-form.component';
import { MICRO_SERVICE } from '@core/constant/system.constants';
import { CommonUtils } from '@shared/services/common-utils.service';
import { Mode, REQUEST_TYPE } from '@shared/constant/common';
import { format } from 'date-fns';
import { Utils } from '@core/utils/utils';
import { IHbtOption } from '@core/models/IOption';
import { SelectModal } from '@shared/component/hbt-select/select.component';

@Component({
  selector: 'payments-form',
  templateUrl: './payments-form.component.html',
  styleUrls: ['./payments-form.component.scss']
})
export class PaymentsFormComponent extends BaseFormComponent<PaymentsModel> implements OnInit {
  serviceName = MICRO_SERVICE.CRM;
  urlLoadData = '/payments';
  paymentsMethods: IHbtOption<string>[] = [
    { value: 'TIEN_MAT', label: 'Tiền mặt' },
    { value: 'CHUYEN_KHOAN', label: 'Chuyển khoản' },
  ];
  constructor(
    private readonly service: PaymentsService,
    injector: Injector
  ) {
    super(injector);
    this.isPage = true;
    this.key = 'paymentId';
    this.findOneById = (id) => this.service.findOneById(id);
    this.createApi = (body: PaymentsModel) => this.service.createOrImport(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.FORM_DATA);
    this.updateApi = (body: PaymentsModel) => this.service.update(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.DEFAULT);
  }

  override initForm() {
    this.form = this.fb.group({
        paymentId: [null],
        orderId: [null],
        paymentDate: [new Date(), [Validators.required]],
        amount: [null, [Validators.required]],
        paymentMethod: ['CHUYEN_KHOAN', [Validators.required]],
        paymentMethodName: ['Chuyển khoản'],
        paymentType: [null, [Validators.required, Validators.maxLength(255)]],
        paymentTypeName: [null],
        accountNo: ['5850608', [Validators.maxLength(20)]],
        bankName: ['ACB', [Validators.maxLength(255)]],
        bankFee: [null],
        note: [null, [Validators.maxLength(255)]],
        customerName: [null],
        caregiverId: [null, [Validators.required]],
        welfareRecipientId: [null],
        introducerId: [null],
        attachFileList: [null],
      },
      {
        validators:
          []
      });
  }



  override initData() {
    if (this.data) {
      this.form.patchValue(this.data);
      // this.form.get('paymentDate').setValue(Utils.convertDateToFillForm(this.data.paymentDate));
      this.form.get('attachFileList').setValue(this.data.attachFileList.map(item => {
        if (item.attachmentId) {
          return {
            uid: item.attachmentId,
            name: item.fileName,
            checkSum: item.checkSum,
            status: 'done'
          };
        } else {
          return item;
        }
      }));
      if (this.mode === Mode.VIEW) {
        this.form.disable();
      }
    }
  }

  override save() {
    this.isSubmitted = true;
    if (this.form.valid) {
      const data = this.form.value;
      if (this.form.get('attachFileList').value) {
        data.fileAttachments = this.form.get('attachFileList').value.filter(el => el instanceof File);
      }
      data.idsDelete = this.docIdsDelete.filter(el => !Number.isNaN(el));
      this.modalRef.close({ data });
    }
  }

  changePaymentMethod(value: 'TIEN_MAT' | 'CHUYEN_KHOAN') {
    this.form.get('paymentMethodName')?.setValue(this.paymentsMethods.find(el => el.value === value)?.label);
    if (value === 'CHUYEN_KHOAN') {
      this.form.get('accountNo')?.setValidators([Validators.required]);
      this.form.get('bankName')?.setValidators([Validators.required]);
    } else {
      this.form.get('accountNo')?.setValue(null);
      this.form.get('accountNo')?.clearValidators();
      this.form.get('bankName')?.setValue(null);
      this.form.get('bankName')?.clearValidators();
    }
    this.form.get('accountNo')?.updateValueAndValidity();
    this.form.get('bankName')?.updateValueAndValidity();
  }

  selectPaymentType(item: any) {
    if (item.itemSelected) {
      this.form.get('paymentTypeName')?.setValue(item.itemSelected.name);
    } else {
      this.form.get('paymentTypeName')?.setValue(null);
    }
  }

  changePaymentType(value: any) {
    if (value !== 'PHI_DON_HANG') {
      this.form.get('introducerId')?.setValidators([Validators.required]);
    } else {
      this.form.get('introducerId')?.setValue(null);
      this.form.get('introducerId')?.clearValidators();
    }
    this.form.get('introducerId')?.updateValueAndValidity();
  }

  selectEmployee(item: any) {
    if (item.itemSelected) {
      this.form.get('fullName')?.setValue(item.itemSelected.fullName);
    } else {
      this.form.get('fullName')?.setValue(null);
    }
  }

  emitCustomer($event: SelectModal) {
    if ($event.itemSelected) {
      this.form.get('customerName')?.setValue($event.itemSelected.fullName);
    } else {
      this.form.get('customerName')?.setValue(null);
    }
  }
}


