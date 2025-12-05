import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ResearchProjectsModel } from '../../../../data-access/models/research-managers/research-projects.model';
import { ResearchProjectsService } from '../../../../data-access/services/research-managers/research-projects.service';
import { BaseFormComponent } from '@core/components/base-form.component';
import { CommonUtils } from '@shared/services/common-utils.service';
import { REQUEST_TYPE } from '@shared/constant/common';
import { Scopes } from '@core/utils/common-constants';
import { DataService } from '@shared/services/data.service';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { ActionSchema, ChildActionSchema } from '@core/models/action.model';
import { FunctionCode } from '@shared/enums/enums-constant';
import { Constant } from '@app/modules/lms/data-access/constants/constants';
import { HTTP_STATUS_CODE, MICRO_SERVICE } from '@core/constant/system.constants';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { Utils } from '@core/utils/utils';
import { NzTabSetComponent } from 'ng-zorro-antd/tabs';
import { CustomValidators } from '@core/utils/custom-validations';

export function greaterThanZero(control: AbstractControl): { [key: string]: boolean } | null {
  if (control.value !== null && control.value <= 0) {
    return { 'greaterThanZero': true };
  }
  return null;
}

@Component({
  selector: 'rps-form',
  templateUrl: './rps-form.component.html',
  styleUrls: ['./rps-form.component.scss']
})
export class RpsFormComponent extends BaseFormComponent<ResearchProjectsModel> implements OnInit {
  @ViewChild(NzTabSetComponent) tabSet: NzTabSetComponent;
  scope: string = Scopes.VIEW;
  serviceName = MICRO_SERVICE.LMS;
  listStatus: any[] = [];
  listRole: any[] = [];
  functionCode = '';
  readonly FORM_ARRAY_NAME = 'listMembers';
  readonly FORM_ARRAY_LIFECYCLE = 'listLifecycles';
  actionSchema: ActionSchema;
  actionSchemaChild: ActionSchema;
  functionCodeEmployee = FunctionCode.HR_PERSONAL_INFO;
  isSubmitted2 = false;
  isSubmitted3 = false;
  constantType = Constant.TYPE;
  constantTitle = Constant.TITLE;
  constantStatus = Constant.STATUS;
  listType = [this.constantType.PHE_DUYET_DE_TAI, this.constantType.CHO_PHEP_THUC_HIEN, this.constantType.NGHIEM_THU_DE_TAI, this.constantType.DANH_GIA_XEP_LOAI];
  listTitle: Map<string, string> = new Map<string, string>([
    [this.constantType.NGHIEM_THU_DE_TAI, this.constantTitle.NGHIEM_THU_DE_TAI],
    [this.constantType.CHO_PHEP_THUC_HIEN, this.constantTitle.CHO_PHEP_THUC_HIEN],
    [this.constantType.PHE_DUYET_DE_TAI, this.constantTitle.PHE_DUYET_DE_TAI],
    [this.constantType.DANH_GIA_XEP_LOAI, this.constantTitle.DANH_GIA_XEP_LOAI]
  ]);
  mapAttributes: Map<string, FormArray> = new Map<string, FormArray>();
  mapAttributeConfig: Map<string, any[]> = new Map<string, any[]>();

  constructor(
    private readonly service: ResearchProjectsService,
    private dataService: DataService,
    injector: Injector
  ) {
    super(injector);
    this.key = 'researchProjectId';
    this.initAction();
    this.initDataSelect();
    this.findOneById = (id) => this.service.findOneById(id);
    this.createApi = (body: ResearchProjectsModel) => this.service.createOrImport(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.FORM_DATA);
    this.updateApi = (body: ResearchProjectsModel) => this.service.update(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.FORM_DATA);
    this.getConfigAttributeApi = () => this.dataService.getAttributeConfig({
      tableName: 'med_research_projects'
    });
    this.getConfigAttributes();
  }

  initDataSelect() {
    this.subscriptions.push(
      this.dataService.getData(this.getUrlCategory(this.categoryCode.NCKH_TRANG_THAI), this.microService.ADMIN).subscribe(res => {
        if (res.code === HTTP_STATUS_CODE.SUCCESS) {
          this.listStatus = res.data;
        }
      })
    );
    this.subscriptions.push(
      this.dataService.getData(this.getUrlCategory(this.categoryCode.NCKH_VAI_TRO), this.microService.ADMIN).subscribe(res => {
        if (res.code === HTTP_STATUS_CODE.SUCCESS) {
          this.listRole = res.data;
        }
      })
    );
  }

  afterPatchValue() {
    super.afterPatchValue();
    if (this.data) {
      this.data?.listMembers?.forEach((it, index) => {
        this.initMembers();
        this.members.controls[index].setValue({
          employeeId: it.employeeId || null,
          roleId: it.roleId || null,
          note: it.note || null
        });
      });
    }
  }

  override initForm() {
    this.form = this.fb.group({
      researchProjectId: [null],
      title: [null, [Validators.required]],
      content: [null, [Validators.required]],
      target: [null, [Validators.required]],
      projectTypeId: [null, [Validators.required]],
      organizationId: [null, [Validators.required]],
      researchLevelId: [null, [Validators.required]],
      researchTopicId: [null, [Validators.required]],
      duration: [null, [Validators.required, greaterThanZero]],
      estimatedBudget: [null, [Validators.required]],
      listAttributes: this.fb.array([]),
      statusId: [null, [Validators.required]],
      listMembers: this.fb.array([]),
      listLifecycles: this.fb.array([])
    }, {
      validators: [CustomValidators.formArrayValidator('listMembers', ['employeeId', 'roleId'], 'employeeId')]
    });
    if (this.mode === this.modeConst.ADD) {
      this.initMembers();
    }
    this.attributesFormArray = this.form?.get('listAttributes') as FormArray;
  }

  get members(): NzSafeAny {
    return this.form.controls[this.FORM_ARRAY_NAME] as FormArray;
  }

  get lifecycles(): NzSafeAny {
    return this.form.controls[this.FORM_ARRAY_LIFECYCLE] as FormArray;
  }

  getListAttribute(type: string) {
    this.dataService.getAttributeConfig({
      tableName: 'med_research_projects',
      functionCode: type
    }).subscribe(res => {
      if (res.code === HTTP_STATUS_CODE.SUCCESS) {
        this.mapAttributeConfig.set(type, res.data);
        this.mapAttributeConfig.get(type)?.forEach(item => {
          const existingFormArray = this.mapAttributes?.get(type) as FormArray;
          existingFormArray.push(this.createAttributesForm(item));
          this.mapAttributes?.set(type, existingFormArray);
        });
        if (this.data) {
          if (this.mapAttributes?.get(type)?.length > 0) {
            while (this.mapAttributes?.get(type)?.length !== 0) {
              this.mapAttributes?.get(type)?.removeAt(0);
            }
          }
          this.mapAttributeConfig.get(type)?.forEach(item => {
            const attributeData = this.data.lifecycles[type][this.keyAttributeData]?.find(v => v.attributeCode?.toLowerCase() === item.code?.toLowerCase());
            item.value = attributeData ? attributeData.attributeValue : null;
            if (item.dataType?.toUpperCase() === 'DATE') {
              item.value = Utils.convertDateToFillForm(item.value);
            }
            const existingFormArray = this.mapAttributes?.get(type) as FormArray;
            existingFormArray.push(this.createAttributesForm(item));
            this.mapAttributes?.set(type, existingFormArray);
          });
        }
      }
    });
  }

  getAttributeChildControl(index: number, controlName: string, type: string): FormControl {
    return this.mapAttributes?.get(type)?.at(index).get(controlName) as FormControl;
  }


  initLifecycles = (type: string) => {
    const controlsConfig: any = {};
    controlsConfig.documentNo = [null, Validators.required];
    controlsConfig.documentSignedDate = [null, Validators.required];
    controlsConfig.listMembers = this.fb.array([]);
    controlsConfig.type = [type];
    controlsConfig.listAttributes = this.fb.array([]);
    controlsConfig.listFileAttachments = [null];
    controlsConfig.attachmentDeleteIds = [[]];
    const lifecycles = this.fb.group(controlsConfig, {
      validators: [CustomValidators.formArrayValidator('listMembers', ['employeeId', 'roleId'], 'employeeId')]
    });
    this.lifecycles.push(lifecycles);
    this.mapAttributes?.set(type, this.lifecycles?.at(this.lifecycles.length - 1).get('listAttributes') as FormArray);
    if (type == this.constantType.NGHIEM_THU_DE_TAI ||
      type == this.constantType.PHE_DUYET_DE_TAI) {
      this.initMembersChild(type);
    }
    this.getListAttribute(type);
  };

  initMembersChild = (type: string) => {
    const controlsConfig: any = {};
    controlsConfig.employeeId = [null, Validators.required];
    controlsConfig.roleId = [null, Validators.required];
    controlsConfig.note = [null];
    const members = this.fb.group(controlsConfig);
    const index = this.lifecycles.controls.findIndex((control: FormGroup) => {
      return control.get('type')?.value === type;
    });
    this.lifecycles.at(index).get('listMembers')?.push(members);
  };


  initMembers = () => {
    const controlsConfig: any = {};
    controlsConfig.employeeId = [null, Validators.required];
    controlsConfig.roleId = [null, Validators.required];
    controlsConfig.note = [null];
    const members = this.fb.group(controlsConfig);
    this.members.push(members);
  };

  initAction() {
    this.actionSchema = new ActionSchema({
      arrAction: [
        new ChildActionSchema({
          label: 'common.button.add',
          icon: 'plus-circle',
          function: this.add
        }),
        new ChildActionSchema({
          label: 'common.button.delete',
          icon: 'delete',
          // isShowFn: this.isShowDelete,
          function: this.onDelete
        })
      ]
    });
    this.actionSchemaChild = new ActionSchema({
      arrAction: [
        new ChildActionSchema({
          label: 'common.button.add',
          icon: 'plus-circle',
          function: this.addChild
        }),
        new ChildActionSchema({
          label: 'common.button.delete',
          icon: 'delete',
          // isShowFn: this.isShowDelete,
          function: this.onDeleteChild
        })
      ]
    });
  }

  add = () => {
    this.isSubmitted2 = true;
    if (this.members.valid) {
      this.initMembers();
      this.isSubmitted2 = false;
    }
  };

  onDelete = (data: FormGroup) => {
    this.popupService.showModalConfirmDelete(() => {
      this.members.removeAt(data['key']);
      if (this.members.length === 0) {
        this.initMembers();
      }
    });
  };

  addChild = (data: FormGroup) => {
    this.isSubmitted3 = true;
    if (this.lifecycles.at(data['parentIndex']).get('listMembers').valid) {
      this.initMembersChild(data['type']);
      this.isSubmitted3 = false;
    }
  };

  onDeleteChild = (data: FormGroup) => {
    this.popupService.showModalConfirmDelete(() => {
      this.lifecycles.at(data['parentIndex']).get('listMembers').removeAt(data['key']);
      if (this.lifecycles.at(data['parentIndex']).get('listMembers').length === 0) {
        this.initMembersChild(data['type']);
      }
    });
  };

  changeFile(listFile: NzUploadFile[], index: number, isMultiple?: boolean) {
    this.lifecycles.at(index).get('listFileAttachments').setValue(isMultiple ? listFile : listFile[0]);
  }

  removeFileChild(ids: number[], index: number) {
    this.lifecycles.at(index).get('attachmentDeleteIds').setValue(ids);
  }

  beforeSave() {
    super.beforeSave();
    this.tabSet.setSelectedIndex(this.lifecycles.controls.findIndex(e => e.invalid));
    this.lifecycles.controls.forEach((it, index) => {
      this.body.listLifecycles[index].listFileAttachments = it.get('listFileAttachments')?.value?.filter(item => item instanceof File);
    });
  }

  viewTab($event) {
    let idx = 0;
    if ($event == this.constantStatus.TU_CHOI_THONG_QUA || $event == this.constantStatus.PHE_DUYET_THONG_QUA) {
      idx = 1;
    } else if ($event == this.constantStatus.CHO_PHEP_THUC_HIEN) {
      idx = 2;
    } else if ($event == this.constantStatus.DA_NGHIEM_THU) {
      idx = 3;
    } else if ($event == this.constantStatus.DA_DANH_GIA) {
      idx = 4;
    }
    this.listType.forEach((it, ix) => {
      const index = this.lifecycles.controls.findIndex((control: FormGroup) => {
        return control.get('type')?.value === it;
      });
      if (ix < idx && index === -1) {
        this.initLifecycles(it);
      } else if (ix >= idx && index !== -1) {
        this.lifecycles.removeAt(index);
      }
    });
    if (this.data) {
      this.lifecycles.controls.forEach((it, index) => {
        it.get('documentNo').setValue(this.data.lifecycles[it.get('type').value].documentNo);
        it.get('documentSignedDate').setValue(this.data.lifecycles[it.get('type').value].documentSignedDate);
        this.data.lifecycles[it.get('type').value]?.listMembers.forEach((it1, idx1) => {
          if (idx1 > 0) {
            this.initMembersChild(index);
          }
          it.get('listMembers').controls[idx1].setValue({
              employeeId: it1.employeeId || null,
              roleId: it1.roleId || null,
              note: it1.note || null
            }
          );
        });
        const files = this.data.lifecycles[it.get('type').value].listFileAttachments?.map(item => {
          return {
            uid: item.attachmentId,
            name: item.fileName,
            checkSum: item.checkSum,
            status: 'done'
          };
        });
        it.get('listFileAttachments').setValue(files);
      });
    }
  };

}


