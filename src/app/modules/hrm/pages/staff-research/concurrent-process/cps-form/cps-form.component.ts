import { Component, Injector, OnInit } from '@angular/core';
import { BaseFormComponent } from '@core/components/base-form.component';
import { UrlConstant } from '@app/modules/hrm/data-access/constant/url.class';
import { CatalogModel } from '@shared/model/catalog-model';
import { DataService } from '@shared/services/data.service';
import { CommonUtils } from '@shared/services/common-utils.service';
import { Mode, REQUEST_TYPE } from '@shared/constant/common';
import { FormArray, Validators } from '@angular/forms';
import { distinctUntilChanged } from 'rxjs';
import { HTTP_STATUS_CODE } from '@core/constant/system.constants';
import { Utils } from '@core/utils/utils';
import { DateValidator } from '@shared/custom-validator/dateValidator.class';
import { ConcurrentProcessModel } from '@app/modules/hrm/data-access/models/research/concurrent-process.model';
import { ConcurrentProcessService } from '@app/modules/hrm/data-access/services/staff-research/concurrent-process.service';
import { FunctionCode } from '@app/shared/enums/enums-constant';
import { Scopes } from '@app/core/utils/common-constants';

@Component({
  selector: 'app-cps-form',
  templateUrl: './cps-form.component.html',
  styleUrls: ['./cps-form.component.scss']
})
export class CpsFormComponent extends BaseFormComponent<ConcurrentProcessModel> implements OnInit {
  listPosition: CatalogModel[] = [];
  data: any;
  hiddenEmp = false;
  employeeId: number;
  functionCode = FunctionCode.HR_CONCURRENT_PROCESS;
  scope = Scopes.CREATE;

  constructor(
    private readonly service: ConcurrentProcessService,
    private dataService: DataService,
    injector: Injector
  ) {
    super(injector);
    this.key = 'concurrentProcessId';
    this.findOneById = (id) => this.service.findOneById(id, this.config ?? `/${this.data.employeeId}`);
    this.createApi = (body: ConcurrentProcessModel) => this.service.createOrImport(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.FORM_DATA_FILE, this.config ?? `/${this.f.employeeId.value}`);
    this.updateApi = (body: ConcurrentProcessModel) => this.service.update(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.FORM_DATA_FILE, this.config ?? `/${this.f.employeeId.value}`);
    this.getConfigAttributeApi = () => this.dataService.getAttributeConfig({tableName: 'hr_concurrent_process'});
    this.getConfigAttributes();
  }

  ngOnInit() {
    super.ngOnInit();
    this.employeeId = this.data?.employeeId;
    if (this.employeeId && this.mode === Mode.ADD) {
      this.form.controls.employeeId.setValue(this.employeeId);
    }
    this.hiddenEmp = this.data.hiddenEmp;
    this.orgChangeValue();
  }

  override initForm() {
    this.form = this.fb.group({
      concurrentProcessId: [null],
      employeeId: [null, [Validators.required]],
      startDate: [null, [Validators.required]],
      endDate: [null],
      positionId: [null, [Validators.required]],
      organizationId: [null, [Validators.required]],
      documentNo: [null, [Validators.maxLength(50)]],
      documentSignedDate: [null],
      files: [null],
      listAttributes: this.fb.array([])
    }, {validators:
        [DateValidator.validateRangeDate('startDate', 'endDate', 'rangeDateError')]
    });

    this.attributesFormArray = this.form?.get('listAttributes') as FormArray;
  }

  orgChangeValue() {
    this.subscriptions.push(
      this.f.organizationId?.valueChanges.pipe(distinctUntilChanged()).subscribe(orgId => {
        this.listPosition = [];
        if (orgId) {
          const urlEndPoint = `${UrlConstant.POSITIONS.GET_BY_ORG}/${orgId}`;
          this.subscriptions.push(
            this.dataService.getData(urlEndPoint, this.microService.HRM).subscribe(res => {
              if (res.code === HTTP_STATUS_CODE.SUCCESS) {
                this.listPosition = res.data;
                if (!this.listPosition.some((item: any) => item.positionId === this.f.positionId.value)) {
                  this.f.positionId.reset(null);
                }
              }
            })
          );
        }
      })
    );
  }

  patchValueInfo() {
    this.form.patchValue(this.data);
    this.f.startDate.setValue(Utils.convertDateToFillForm(this.data.startDate));
    this.f.endDate.setValue(Utils.convertDateToFillForm(this.data.endDate));
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
      id: this.body.concurrentProcessId,
      data: {...data, attachmentDeleteIds: this.docIdsDelete},
      files: this.f.files.value?.filter(item => item instanceof File)
    };
  }

}
