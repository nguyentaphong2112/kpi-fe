import { Component, Injector, OnInit } from '@angular/core';
import { BaseFormComponent } from '@core/components/base-form.component';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import {
  InsuranceContributionsService
} from '@app/modules/icn/data-access/services/caculate/insurance-contributions.service';
import { DateValidator } from '@shared/custom-validator/dateValidator.class';
import { Validators } from '@angular/forms';
import { REQUEST_TYPE } from '@shared/constant/common';
import { ObjectUtil } from '@core/utils/object.util';
import { Constant } from '@app/modules/icn/data-access/constants/constant';
import { distinctUntilChanged } from 'rxjs';
import { HTTP_STATUS_CODE } from '@core/constant/system.constants';
import { format } from 'date-fns';

@Component({
  selector: 'app-arrears-pre-medical',
  templateUrl: './arrears-pre-medical.component.html',
  styleUrls: ['./arrears-pre-medical.component.scss']
})
export class ArrearsPreMedicalComponent extends BaseFormComponent<NzSafeAny> implements OnInit {
  isImport = true;
  fileTemplateName = 'templateImport.xlsx';
  listInputType = ObjectUtil.optionsToList(Constant.LIST_INPUT_TYPE, this.translate);
  listType = ObjectUtil.optionsToList(Constant.LIST_TYPE, this.translate);


  importApi = (body) => this.service.createOrImport2(body, REQUEST_TYPE.DEFAULT, '/retro-medical/import', { periodDate: this.data.periodDate });
  downLoadTemplateApi = () => this.service.downloadFile('/retro-medical/download-template', { periodDate: this.data.periodDate });
  doDownloadFileByNameApi = (url: string, fileName: string) => this.service.downloadFileByName(url, { fileName: fileName });

  constructor(
    injector: Injector,
    private readonly service: InsuranceContributionsService
  ) {
    super(injector);
    this.key = 'insuranceContributionId';
  }

  override initForm() {
    this.form = this.fb.group({
      inputType: [0],
      keySearch: [null, [Validators.required]],
      isIndividuals: [null],
      fromPeriodDate: [null, [Validators.required]],
      toPeriodDate: [null, [Validators.required]],
      isUnitPayed: [null]
    }, {
      validators:
        [DateValidator.validateRangeDate('fromPeriodDate', 'toPeriodDate', 'rangeDateError')]
    });

    this.f['inputType'].valueChanges.pipe(distinctUntilChanged()).subscribe(data => {
      this.isImport = data == 0;
    });
  }

  override save() {
    this.isSubmitted = true;
    if (this.form.valid) {
      const data = this.form.value;
      this.service.createOrImport2({
        ...data,
        fromPeriodDate: format(this.f['fromPeriodDate'].value, 'dd/MM/yyyy'),
        toPeriodDate: format(this.f['toPeriodDate'].value, 'dd/MM/yyyy'),
        empCodes: this.f['keySearch'].value
      }, REQUEST_TYPE.DEFAULT, '/retro-medical', { periodDate: this.data.periodDate })
        .subscribe(res => {
          if (res.code === HTTP_STATUS_CODE.SUCCESS) {
            this.toast.success(this.translate.instant('common.notification.updateSuccess'));
            this.modalRef?.close({ refresh: true });
          }
        });
    }
  }

  doCloseImport(isSearch: boolean) {
    this.modalRef?.close({ refresh: isSearch });
  }


}
