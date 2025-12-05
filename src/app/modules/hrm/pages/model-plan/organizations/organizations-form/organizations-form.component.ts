import { Component, EventEmitter, Injector, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';
import { BaseFormComponent } from '@core/components/base-form.component';
import { AppFunction } from '@core/models/app-function.interface';
import { Scopes } from '@core/utils/common-constants';
import { FormArray, Validators } from '@angular/forms';
import { DateValidator } from '@shared/custom-validator/dateValidator.class';
import { CategoryModel } from '@core/models/category-common.interface';
import { HTTP_STATUS_CODE, MICRO_SERVICE } from '@core/constant/system.constants';
import { Utils } from '@core/utils/utils';
import { DataService } from '@shared/services/data.service';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { CommonUtils } from '@shared/services/common-utils.service';
import { Constant } from '@app/modules/hrm/data-access/constant/constant.class';
import { OrgService } from '@app/modules/hrm/data-access/services/model-plan/org.service';
import { ObjectUtil } from '@core/utils/object.util';
import { AlertModalChangeService } from '@app/modules/hrm/data-access/services/staff-info/alert-modal-change.service';

@Component({
  selector: 'app-organizations-form',
  templateUrl: './organizations-form.component.html',
  styleUrls: ['./organizations-form.component.scss']
})
export class OrganizationsFormComponent extends BaseFormComponent<any> implements OnInit, OnChanges, OnDestroy {
  @Input() nodeId!: number;
  @Output() reloadOrgTree: EventEmitter<boolean> = new EventEmitter<boolean>();
  serviceNameAdmin = MICRO_SERVICE.ADMIN;
  constant = Constant;
  listVirtualUnit: CategoryModel[] = [];
  functionCode = 'HR_MODEL_PLAN';
  objFunction!: AppFunction;
  scope = Scopes.EDIT;
  listAttributeConfig = [];

  constructor(injector: Injector,
              private service: OrgService,
              private dataService: DataService,
              private alertModalService: AlertModalChangeService) {
    super(injector);
    this.key = 'organizationId';
    this.findOneById = (id) => this.service.findOneById(id);
    this.updateApi = (body: NzSafeAny) => this.service.update(CommonUtils.convertDataSendToServer(body), null);
    this.createApi = (body: NzSafeAny) => this.service.createOrImport(CommonUtils.convertDataSendToServer(body), null);
    this.getConfigAttributeApi = () => this.dataService.getAttributeConfig({ tableName: 'hr_organizations' });
    this.objFunction = this.sessionService.getSessionData(`FUNCTION_${this.functionCode}`);
    this.initDateSelect();
    this.initForm();
  }

  ngOnChanges() {
    if (this.nodeId) {
      this.pathFormValue();
    }
  }

  initForm() {
    this.form = this.fb.group({
      code: [null, [Validators.required]],
      name: [null, [Validators.required]],
      orderNumber: [null],
      parentId: [null],
      orgTypeId: [null],
      establishmentReasonId: [null],
      startDate: [null, [Validators.required]],
      endDate: [null],
      listConstraintOrgIds: [null],
      listAttributes: this.fb.array([])
    }, {
      validators: [
        DateValidator.validateRangeDate('startDate', 'endDate', 'rangeDateError')
      ]
    });

    this.attributesFormArray = this.form?.get('listAttributes') as FormArray;
  }

  initDateSelect() {
    this.listVirtualUnit = ObjectUtil.optionsToList(Constant.LIST_YES_NO, this.translate);
    this.getConfigAttributes();
  }

  pathFormValue() {
    this.findOneById(this.nodeId).subscribe(res => {
      if (res.code === HTTP_STATUS_CODE.SUCCESS) {
        res.data.orgTypeId = res.data.orgTypeId?.toString();
        this.form.patchValue(res.data);
        this.data = res.data;
        this.afterPatchValue();
      }
    });
  }

  afterPatchValue() {
    super.afterPatchValue();
    this.id = this.data[this.key];
    this.f.listConstraintOrgIds.setValue(this.data.listRelatedOrg?.map(item => item.constraintOrgId));
    this.f.startDate.setValue(Utils.convertDateToFillForm(this.data.startDate));
    this.f.endDate.setValue(Utils.convertDateToFillForm(this.data.endDate));
    this.f.orgTypeId.setValue(this.data.orgTypeId?.toString());
  }

  afterSave() {
    this.isSubmitted = false;
    this.reloadOrgTree.emit(true);
    this.alertModalService.closeOrg();
  }

  ngOnDestroy(): void {
    this.subscriptions?.forEach(sub => sub.unsubscribe());
  }

}
