import { Component, Injector, OnInit } from '@angular/core';
import { DataService } from '@shared/services/data.service';
import { EducationDegreesModel } from '@app/modules/hrm/data-access/models/research/education-degrees.model';
import { CommonUtils } from '@shared/services/common-utils.service';
import { Mode, REQUEST_TYPE } from '@shared/constant/common';
import { BaseFormComponent } from '@core/components/base-form.component';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import {
  PlanningAssignmentsService
} from '@app/modules/hrm/data-access/services/staff-research/planning-assignments.service';
import { FunctionCode } from '@shared/enums/enums-constant';
import { FormArray, Validators } from '@angular/forms';
import { Scopes } from '@core/utils/common-constants';
import { DateValidator } from '@shared/custom-validator/dateValidator.class';
import { $e } from 'codelyzer/angular/styles/chars';
import { Utils } from '@core/utils/utils';

@Component({
  selector: 'app-pas-form',
  templateUrl: './pas-form.component.html',
  styleUrls: ['./pas-form.component.scss']
})
export class PasFormComponent extends BaseFormComponent<NzSafeAny> implements OnInit {
  hiddenEmp = false;
  data: any;
  employeeId: number;
  functionCode = FunctionCode.HR_PLANNING_ASSIGNMENTS;
  scope = Scopes.CREATE;
  isShow = false;

  constructor(
    private readonly service: PlanningAssignmentsService,
    private dataService: DataService,
    injector: Injector
  ) {
    super(injector);
    this.key = 'planningAssignmentId';
    this.initForm();
    this.findOneById = (id) => this.service.findOneById(id, this.config ?? `/${this.data.employeeId}`);
    this.createApi = (body: EducationDegreesModel) => this.service.createOrImport(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.FORM_DATA_FILE, this.config ?? `/${this.f.employeeId.value}`);
    this.updateApi = (body: EducationDegreesModel) => this.service.update(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.FORM_DATA_FILE, this.config ?? `/${this.f.employeeId.value}`);
    this.getConfigAttributeApi = () => this.dataService.getAttributeConfig({ tableName: 'hr_planning_assignments' });
    this.getConfigAttributes();
  }

  ngOnInit() {
    super.ngOnInit();
    this.employeeId = this.data?.employeeId;
    if (this.employeeId && this.mode === Mode.ADD) {
      this.form.controls.employeeId.setValue(this.employeeId);
    }
    this.hiddenEmp = this.data.hiddenEmp;
  }


  initForm() {
    this.form = this.fb.group({
        planningAssignmentId: [null],
        employeeId: [null, [Validators.required]],
        planningPeriodId: [null, [Validators.required]],
        positionId: [null, [Validators.required]],
        documentNo: [null],
        documentSignedDate: [null],
        startDate: [null, [Validators.required]],
        endDate: [null],
        endReasonId: [null],
        endDocumentNo: [null],
        endDocumentSignedDate: [null],
        files: [null],
        listAttributes: this.fb.array([])
      },
      {
        validators:
          [DateValidator.validateRangeDate('startDate', 'endDate', 'rangeDateError')]
      });

    this.attributesFormArray = this.form?.get('listAttributes') as FormArray;
  }

  changeShow($event) {
    this.isShow = !!$event;
    if (!$event) {
      this.f.endReasonId.setValue(null);
      this.f.endDocumentNo.setValue(null);
      this.f.endDocumentSignedDate.setValue(null);
    }
  }

  patchValueInfo() {
    this.form.patchValue(this.data);
    this.f?.documentSignedDate?.setValue(Utils.convertDateToFillForm(this.data?.documentSignedDate));
    this.f?.startDate?.setValue(Utils.convertDateToFillForm(this.data?.startDate));
    this.f?.endDate?.setValue(Utils.convertDateToFillForm(this.data?.endDate));
    this.f?.endDocumentSignedDate?.setValue(Utils.convertDateToFillForm(this.data?.endDocumentSignedDate));
    const files = this.data.attachFileList?.map(item => {
      return {
        uid: item.attachmentId,
        name: item.fileName,
        checkSum: item.checkSum,
        status: 'done'
      };
    });
    this.f.files.setValue(files);
  }

  beforeSave() {
    const data = this.form.value;
    delete data?.files;
    this.body = {
      id: this.body.planningAssignmentId,
      data: {
        ...data,
        attachmentDeleteIds: this.docIdsDelete,
        documentSignedDate: Utils.convertDateToSendServer(this.f.documentSignedDate.value),
        startDate: Utils.convertDateToSendServer(this.f.startDate.value),
        endDate: Utils.convertDateToSendServer(this.f.endDate.value),
        endDocumentSignedDate: Utils.convertDateToSendServer(this.f.endDocumentSignedDate.value)
      },
      files: this.f.files.value?.filter(item => item instanceof File)
    };
  }

}
