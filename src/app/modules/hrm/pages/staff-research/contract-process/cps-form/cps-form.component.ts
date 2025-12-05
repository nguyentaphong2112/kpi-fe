import { Component, Injector, OnInit } from '@angular/core';
import { BaseFormComponent } from '@core/components/base-form.component';
import { CatalogModel } from '@shared/model/catalog-model';
import { DataService } from '@shared/services/data.service';
import { CommonUtils } from '@shared/services/common-utils.service';
import { Mode, REQUEST_TYPE } from '@shared/constant/common';
import { FormArray, Validators } from '@angular/forms';
import { DateValidator } from '@shared/custom-validator/dateValidator.class';
import { distinctUntilChanged } from 'rxjs';
import { UrlConstant } from '@app/modules/hrm/data-access/constant/url.class';
import { HTTP_STATUS_CODE, MICRO_SERVICE } from '@core/constant/system.constants';
import { Utils } from '@core/utils/utils';
import { ContractProcessModel } from '@app/modules/hrm/data-access/models/research/contract-process.model';
import { ContractProcessService } from '@app/modules/hrm/data-access/services/staff-research/contract-process.service';
import { FunctionCode } from '@app/shared/enums/enums-constant';
import { Scopes } from '@app/core/utils/common-constants';

@Component({
  selector: 'app-cps-form',
  templateUrl: './cps-form.component.html',
  styleUrls: ['./cps-form.component.scss']
})
export class CpsFormComponent extends BaseFormComponent<ContractProcessModel> implements OnInit {
  listContractType: CatalogModel[] = [];
  urlConstant = UrlConstant;
  data: any;
  hiddenEmp = false;
  employeeId: number;
  listEmpTypes: any[] = [];
  isShowSelectContract =  true;
  functionCode = FunctionCode.HR_CONTRACT_PROCESS;
  scope = Scopes.CREATE;
  isExistsContract: string;
  isRequiredEndDate = false;

  constructor(
    private readonly service: ContractProcessService,
    private dataService: DataService,
    injector: Injector
  ) {
    super(injector);
    this.getListEmpTypes();
    this.key = 'contractProcessId';
    this.findOneById = (id) => this.service.findOneById(id, this.config ?? `/${this.data.employeeId}`);
    this.createApi = (body: ContractProcessModel) => this.service.createOrImport(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.FORM_DATA_FILE, this.config ?? `/${this.f.employeeId.value}`);
    this.updateApi = (body: ContractProcessModel) => this.service.update(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.FORM_DATA_FILE, this.config ?? `/${this.f.employeeId.value}`);
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
    this.subChangeFormValue();
    this.subChangeEmpType();
  }

  override initForm() {
    this.form = this.fb.group({
      contractProcessId: [null],
      employeeId: [null, [Validators.required]],
      empTypeId: [null, [Validators.required]],
      startDate: [null, [Validators.required]],
      endDate: [null],
      classifyCode: [null, [Validators.required]],
      contractTypeId: [null, [Validators.required]],
      documentNo: [null, [Validators.maxLength(50)]],
      documentSignedDate: [null],
      files: [null],
      listAttributes: this.fb.array([])
    }, {validators:
        [DateValidator.validateRangeDate('startDate', 'endDate', 'rangeDateError')]
    });

    this.attributesFormArray = this.form?.get('listAttributes') as FormArray;
  }

  getListEmpTypes() {
    this.subscriptions.push(
      this.dataService.getDataByParam(UrlConstant.EMP_TYPES.GET_LIST, {isGetAttributes: true}, MICRO_SERVICE.HRM).subscribe(res => {
        if (res.code === HTTP_STATUS_CODE.SUCCESS) {
          this.listEmpTypes = res.data;
        }
      })
    );
  }

  subChangeEmpType() {
    this.subscriptions.push(
      this.f.empTypeId.valueChanges.pipe(distinctUntilChanged()).subscribe(empTypeId => {
        const empType = this.listEmpTypes.find(item => item.empTypeId === empTypeId);
        this.isExistsContract = empType?.listAttributes?.find(item => item.attributeCode === 'EXISTS_CONTRACT')?.attributeValue;
        if (this.isExistsContract && this.isExistsContract !== 'Y') {
          this.isShowSelectContract = false;
          this.f.classifyCode.setValidators(null);
          this.f.contractTypeId.setValidators(null);
          this.f.classifyCode.setValue(null);
          this.f.contractTypeId.setValue(null);
        } else {
          this.isShowSelectContract = true;
          this.f.classifyCode.setValidators([Validators.required]);
          this.f.contractTypeId.setValidators([Validators.required]);
        }
        this.f.classifyCode.updateValueAndValidity();
        this.f.contractTypeId.updateValueAndValidity();
      })
    );
  }

  subChangeFormValue() {
    this.subscriptions.push(
      this.f.classifyCode?.valueChanges.pipe(distinctUntilChanged()).subscribe(value => {
        this.listContractType = [];
        if (value && this.f.empTypeId.value) {
          const params = {classifyCode: value, empTypeId: this.f.empTypeId.value}
          this.getListContractType(params);
        }
      })
    );

    this.subscriptions.push(
      this.f.empTypeId?.valueChanges.pipe(distinctUntilChanged()).subscribe(value => {
        this.listContractType = [];
        if (value && this.f.classifyCode.value) {
          const params = {classifyCode: this.f.classifyCode.value, empTypeId: value}
          this.getListContractType(params);
        }
      })
    )
  }

  getListContractType(params) {
    params = {
      ...params,
      isGetAttribute: true
    };
    this.subscriptions.push(
      this.dataService.getDataByParam(UrlConstant.CONTRACT_TYPES.GET_LIST, params, this.microService.HRM).subscribe(res => {
        if (res.code === HTTP_STATUS_CODE.SUCCESS) {
          this.listContractType = res.data;
          if (!this.listContractType.some((item: any) => item.contractTypeId === this.f.contractTypeId.value)) {
            this.f.contractTypeId.reset(null);
          }
          if (this.f.contractTypeId.value) {
            this.changeContractType(this.f.contractTypeId.value);
          }
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
      id: this.body.contractProcessId,
      data: {...data, attachmentDeleteIds: this.docIdsDelete},
      files: this.f.files.value?.filter(item => item instanceof File)
    };
  }

  changeContractType(value) {
    const contractType: any = this.listContractType.find((item: any) => item.contractTypeId === value);
    if (contractType?.listAttributes?.some(item => item.attributeCode === 'REQUIRED_END_DATE' && item.attributeValue === 'Y')) {
      this.isRequiredEndDate = true;
      this.f.endDate.setValidators([Validators.required]);
    } else {
      this.isRequiredEndDate = false;
      this.f.endDate.setValidators(null);
    }
    this.f.endDate.updateValueAndValidity();
  }

}
