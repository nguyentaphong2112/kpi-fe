import { Component, Injector, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormArray, FormGroup, Validators } from '@angular/forms';
import { EmployeesModel, ProfileAttachments } from '../../../../data-access/models/hrm-managers/employees.model';
import { EmployeesService } from '../../../../data-access/services/hrm-managers/employees.service';
import { BaseFormComponent } from '@core/components/base-form.component';
import { HTTP_STATUS_CODE, MICRO_SERVICE } from '@core/constant/system.constants';
import { CommonUtils } from '@shared/services/common-utils.service';
import { Mode, REQUEST_TYPE } from '@shared/constant/common';
import { Constant } from '@app/modules/crm/data-access/constants/constants';
import { UrlConstant } from '@app/modules/crm/data-access/constants/url.class';
import { CategoryModel } from '@core/models/category-common.interface';
import { DataService } from '@shared/services/data.service';
import { CustomValidators } from '@core/utils/custom-validations';
import { FrsFormComponent } from '@app/modules/crm/pages/hrm-managers/family-relationships/frs-form/frs-form.component';
import { FamilyRelationshipsModel } from '@app/modules/crm/data-access/models/hrm-managers/family-relationships.model';
import { AttachmentsComponent } from '@app/modules/crm/pages/hrm-managers/employees/attachments/attachments.component';
import _ from 'lodash';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'employees-form',
  templateUrl: './employees-form.component.html',
  styleUrls: ['./employees-form.component.scss']
})
export class EmployeesFormComponent extends BaseFormComponent<EmployeesModel> implements OnInit {
  @ViewChild('footerTmpl', { static: true }) footerTpl!: TemplateRef<any>;
  listProvinces: CategoryModel[] = [];
  listDistricts: CategoryModel[] = [];
  listWards: CategoryModel[] = [];
  serviceName = MICRO_SERVICE.CRM;
  urlLoadData = '/employees';
  familyRelationships: FamilyRelationshipsModel[] = [];
  profileAttachments: ProfileAttachments[] = [];
  familyRelationshipIdDelete: number[] = [];
  fmsModalRef: NzModalRef;
  isDisabledValue = true;
  isFocus = false;

  constructor(
    private readonly service: EmployeesService,
    private dataService: DataService,
    injector: Injector
  ) {
    super(injector);
    this.key = 'employeeId';
    this.findOneById = (id) => this.service.findOneById(id);
    this.createApi = (body: EmployeesModel) => this.service.createOrImport(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.FORM_DATA);
    this.updateApi = (body: EmployeesModel) => this.service.update(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.FORM_DATA);
    this.getConfigAttributeApi = () => this.dataService.getAttributeConfig({
      tableName: 'crm_employees',
      functionCode: Constant.FUNCTION_CODE.CRM_EMPLOYEES
    });
    this.getConfigAttributes();
    this.getListProvinces();
  }

  override initForm() {
    this.form = this.fb.group({
        employeeId: [null],
        fullName: [null, [Validators.required, Validators.maxLength(255)]],
        dateOfBirth: [null, [Validators.required]],
        mobileNumber: [null, [Validators.required, CustomValidators.phoneMobileVN]],
        loginName: [null],
        password: [123456, this.mode === this.modeConst.ADD ? [Validators.required, Validators.maxLength(255)] : []],
        genderId: [null, [Validators.required, Validators.maxLength(20)]],
        email: [null, [Validators.required, Validators.maxLength(255)]],
        zaloAccount: [null, [Validators.required, Validators.maxLength(255)]],
        positionTitleId: [null, [Validators.required, Validators.maxLength(20)]],
        departmentId: [null, [Validators.required, Validators.maxLength(20)]],
        managerId: [null],
        jobRankId: [null, [Validators.required, Validators.maxLength(20)]],
        provinceId: [null, [Validators.required, Validators.maxLength(20)]],
        districtId: [null, [Validators.required, Validators.maxLength(20)]],
        wardId: [null, [Validators.required, Validators.maxLength(20)]],
        villageAddress: [null, [Validators.required, Validators.maxLength(255)]],
        bankAccount: [null],
        bankName: [null],
        bankBranch: [null],
        status: [null, Validators.required],
        personalIdNo: [null],
        taxNo: [null],
        insuranceNo: [null],
        listAttributes: this.fb.array([]),
      },
      {
        validators:
          []
      });
    this.attributesFormArray = this.form?.get('listAttributes') as FormArray;
  }

  ngOnInit() {
    super.ngOnInit();
    this.fmsModalRef = this.modalRef;
  }

  changeProvinceId(value: number, formControl?: FormGroup, isAction?: boolean) {
    if (value) {
      this.changeProvince(value, 'HK', formControl, isAction);
    } else {
      if (formControl) {
        formControl.get('listDistricts').setValue([]);
        formControl.get('listWards').setValue([]);
        if (isAction) {
          formControl.get('districtId').reset();
          formControl.get('wardId').reset();
        }
      } else {
        this.listDistricts = [];
        this.listWards = [];
        this.f.districtId.reset();
        this.f.wardId.reset();
      }
    }
  }
  changeDistrictId(value: number, formControl?: FormGroup, isAction?: boolean) {
    if (value) {
      this.changeDistrict(value, 'HK', formControl, isAction);
    } else {
      if (formControl) {
        formControl.get('listWards').setValue([]);
        if (isAction) {
          formControl.get('wardId').reset();
        }
      } else {
        this.listWards = [];
        this.f.wardId.reset();
      }
    }
  }

  getListProvinces() {
    const url = this.getUrlCategory(this.categoryCode.TINH);
    this.subscriptions.push(
      this.dataService.getData(url, this.microService.ADMIN, true).subscribe(res => {
        if (res.code === HTTP_STATUS_CODE.SUCCESS) {
          this.listProvinces = res.data;
        }
      })
    );
  }

  changeProvince(value: string | number, type: 'HK' | 'HT', formControl?: FormGroup, isAction?: boolean) {
    if (value) {
      const url = UrlConstant.CATEGORY_ADDRESS.GET_DISTRICT + `/${value}`;
      this.subscriptions.push(
        this.dataService.getData(url, this.microService.ADMIN, true).subscribe(res => {
          if (res.code === HTTP_STATUS_CODE.SUCCESS) {
            if (type === 'HK') {
              if (formControl) {
                formControl.get('listDistricts').setValue(res.data);
                if (!this.listWards.some(item => item.value === formControl.get('districtId').value) && isAction) {
                  formControl.get('districtId').reset();
                  formControl.get('wardId').reset();
                }
              } else {
                this.listDistricts = res.data;
                if (!this.listDistricts.some(item => item.value === this.f.districtId.value)) {
                  this.f.districtId.reset();
                  this.f.wardId.reset();
                }
              }
            }
          }
        })
      );
    }
  }

  changeDistrict(value: number, type: 'HK' | 'HT', formControl?: FormGroup, isAction?: boolean) {
    if (value) {
      const url = UrlConstant.CATEGORY_ADDRESS.GET_WARDS + `/${value}`;
      this.subscriptions.push(
        this.dataService.getData(url, this.microService.ADMIN, true).subscribe(res => {
          if (res.code === HTTP_STATUS_CODE.SUCCESS) {
            if (type === 'HK') {
              if (formControl) {
                formControl.get('listWards').setValue(res.data);
                if (!this.listWards.some(item => item.value === formControl.get('wardId').value) && isAction) {
                  formControl.get('wardId').reset();
                }
              } else {
                this.listWards = res.data;
                if (!this.listWards.some(item => item.value === this.f.wardId.value)) {
                  this.f.wardId.reset();
                }
              }
            }
          }
        })
      );
    }
  }

  onLabelClick() {
    this.isFocus = !this.isFocus;
  }

  beforePatchValue() {
    for (const el of this.data.profileAttachments)  {
      el.attachFileList = el.attachFileList.map(item => {
        return {
          uid: item.attachmentId,
          name: item.fileName,
          checkSum: item.checkSum,
          status: 'done'
        };
      });
    }
    this.familyRelationships = this.data.familyRelationships;
    this.profileAttachments = this.data.profileAttachments;
  }

  beforeSave() {
    this.body.profileAttachments = _.clone(this.profileAttachments);
    this.body.profileAttachments.forEach(el => {
      el.fileAttachments = el.attachFileList.filter(file => file instanceof File);
    });
    this.body.familyRelationships = this.familyRelationships;
    this.body.familyRelationshipIdDelete = this.familyRelationshipIdDelete;
  }

  doOpenForm(type?: Mode, index?: number) {
    const data = type === Mode.EDIT ? this.familyRelationships[index] : null;
    this.modalRef = this.modal.create({
      nzWidth: this.getNzWidth(),
      nzTitle: this.getModeTitle(type),
      nzContent: FrsFormComponent,
      nzComponentParams: {
        mode: type,
        data: data
      },
      nzFooter: this.footerTpl,
    });
    this.modalRef.afterClose.subscribe((result) => {
      this.modalRef = this.fmsModalRef;
      if (result?.data) {
        if (type === Mode.EDIT) {
          this.familyRelationships[index] = {...result.data};
        } else {
          this.familyRelationships.push(result.data);
        }
      }
    });
  }

  onDelete(idx: number) {
    this.popupService.showModalConfirmDelete(() => {
      if (this.familyRelationships[idx].familyRelationshipId) {
        this.familyRelationshipIdDelete.push(this.familyRelationships[idx].familyRelationshipId);
      }
      this.familyRelationships.splice(idx, 1);
    });
  }

  doOpenFormAttachment(type?: Mode, index?: number) {
    this.modalRef = this.modal.create({
      nzWidth: '50%',
      nzTitle: this.translate.instant('crm.employees.label.attachments'),
      nzContent: AttachmentsComponent,
    });
    this.modalRef.afterClose.subscribe((result) => {
      this.modalRef = this.fmsModalRef;
      if (result) {
        const item = this.profileAttachments.find(el => el.attachmentType === result.attachmentType);
        if (item) {
          item.attachFileList.push(...result.attachFileList);
        } else {
          this.profileAttachments.push(result);
        }
      }
    });
  }

  onDeleteAttachment(idx: number, attachment: ProfileAttachments) {
    this.popupService.showModalConfirmDelete(() => {
      if (attachment.attachFileList[idx].status === 'done') {
        if (!attachment.idsDelete) {
          attachment.idsDelete = [];
        }
        attachment.idsDelete.push(attachment.attachFileList[idx].uid);
      }
      attachment.attachFileList.splice(idx, 1);
    });
  }

  downloadFile = (file) => {
    if (file) {
      const url = '/v1/attachment-file/download/{attachmentId}/{checksum}'.replace('{attachmentId}', file.uid).replace('{checksum}', file.checkSum);
      this.service.downloadFileByName(url).subscribe();
    }
  }
}


