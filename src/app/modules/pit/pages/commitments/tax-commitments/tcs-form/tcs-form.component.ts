import {Component, Injector, OnInit} from '@angular/core';
import {FormGroup, Validators} from "@angular/forms";
import {TaxCommitmentsModel} from "../../../../data-access/models/commitments/tax-commitments.model";
import {TaxCommitmentsService} from "../../../../data-access/services/commitments/tax-commitments.service";
import {BaseFormComponent} from "@core/components/base-form.component";
import {DateValidator} from "@shared/custom-validator/dateValidator.class";
import {MICRO_SERVICE} from "@core/constant/system.constants";
import {CommonUtils} from "@shared/services/common-utils.service";
import {REQUEST_TYPE} from "@shared/constant/common";
import {Utils} from "@core/utils/utils";

@Component({
  selector: 'tcs-form',
  templateUrl: './tcs-form.component.html',
  styleUrls: ['./tcs-form.component.scss']
})
export class TcsFormComponent extends BaseFormComponent<TaxCommitmentsModel> implements OnInit {

  serviceName = MICRO_SERVICE.PIT
  urlLoadData = '/tax-commitment'
  constructor(
    private readonly service: TaxCommitmentsService,
    injector: Injector
  ) {
    super(injector);
    this.isPage = false
    this.key = 'taxCommitmentId'

    this.findOneById = (id) => this.service.findOneById(id);
    this.createApi = (body: TaxCommitmentsModel) => this.service.createOrImport(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.FORM_DATA);
    this.updateApi = (body: TaxCommitmentsModel) => this.service.update(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.FORM_DATA);
  }

  override initForm() {
    this.form = this.fb.group({
      taxCommitmentId: [null],
      employeeId: [null, [Validators.required]],
      incomeAmount: [null, [Validators.required]],
      startDate: [null, [Validators.required]],
      endDate: [null],
      description: [null, [Validators.maxLength(500)]],
      fileList: [null, [Validators.required]]
    },
    {validators:
        [DateValidator.validateRangeDate('startDate', 'endDate', 'rangeDateError')]
    });
  }

  patchValueInfo() {
    this.form.patchValue(this.data);
    this.f.startDate.setValue(Utils.convertDateToFillForm(this.data.startDate, 'MM/yyyy'));
    this.f.endDate.setValue(Utils.convertDateToFillForm(this.data.endDate, 'MM/yyyy'));
    this.afterPatchValue();
    const files = this.data.attachFileList?.map(item => {
      return {
        uid: item.attachmentId,
        name: item.fileName,
        checkSum: item.checkSum,
        status: 'done'
      };
    });
    this.f?.fileList?.setValue(files);
  }


  beforeSave() {
    const data = this.form.value;
    delete data?.attachFileList;
    this.body = {
      id: this.body.taxCommitmentId,
      ...data,
      attachmentDeleteIds: this.docIdsDelete,
      fileList: this.f.fileList.value?.filter(item => item instanceof File)
    };
  }

}


