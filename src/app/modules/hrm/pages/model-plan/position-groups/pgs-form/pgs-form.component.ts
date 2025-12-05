import { Component, Injector, OnInit } from '@angular/core';
import { BaseFormComponent } from '@core/components/base-form.component';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { PositionGroupsService } from '@app/modules/hrm/data-access/services/model-plan/position-groups.service';
import { CommonUtils } from '@shared/services/common-utils.service';
import { Mode, REQUEST_TYPE } from '@shared/constant/common';
import { DataService } from '@shared/services/data.service';
import { FormArray, Validators } from '@angular/forms';
import { UrlConstant } from '@app/modules/hrm/data-access/constant/url.class';
import { HTTP_STATUS_CODE, MICRO_SERVICE } from '@core/constant/system.constants';
import { Scopes } from '@core/utils/common-constants';
import { Constant } from '@app/modules/hrm/data-access/constant/constant.class';
import { JobsService } from '@app/modules/hrm/data-access/services/model-plan/jobs.service';

@Component({
  selector: 'app-pgs-form',
  templateUrl: './pgs-form.component.html',
  styleUrls: ['./pgs-form.component.scss']
})
export class PgsFormComponent extends BaseFormComponent<NzSafeAny> implements OnInit {

  urlLoadGroupType = UrlConstant.CATEGORY.GET_LIST_GROUP_TYPE;
  serviceName = MICRO_SERVICE.ADMIN;
  readonly FORM_ARRAY_NAME = 'configs';
  functionCode = 'HR_POSITION_GROUPS';
  scope = Scopes.EDIT;
  jobList = [];

  constructor(injector: Injector,
              private pgsService: PositionGroupsService,
              private dataService: DataService,
              private jobService: JobsService) {
    super(injector);
    this.initDataSelect();
    this.findOneById = (id) => this.pgsService.findOneById(id);
    this.createApi = (body: any) => this.pgsService.createOrImport(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.DEFAULT);
    this.updateApi = (body: any) => this.pgsService.update(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.DEFAULT);
    this.getConfigAttributeApi = () => this.dataService.getAttributeConfig({
      tableName: 'hr_position_groups',
      functionCode: 'HR_POSITION_GROUPS'
    });
    this.isPage = false;
    this.key = 'positionGroupId';
    this.getConfigAttributes();
  }

  initDataSelect() {
    this.jobService.getList({ jobType: [Constant.SALARY_TYPES.CHUC_VU, Constant.SALARY_TYPES.CONG_VIEC] }, UrlConstant.JOBS.GET_BY_JOB_TYPE)
      .subscribe(res => {
        if (res.code === HTTP_STATUS_CODE.SUCCESS) {
          this.jobList = res.data;
        }
      });
  }


  beforePatchValue() {
    if (this.data) {
      this.data?.configs?.forEach((it, index) => {
        this.initConfigs();
        this.configs.controls[index].setValue({
          organizationId: it.organizationId || null,
          orgTypeId: it.orgTypeId || null,
          jobIds: it.jobs.map(it => it.jobId) || []
        });
      });
    }
  }

  getWidth() {
    const width = 90 / 3;
    return width.toString() + '%';
  }


  override initForm() {
    this.form = this.fb.group({
      name: [null, [Validators.required, Validators.maxLength(255)]],
      code: [null, [Validators.required, Validators.maxLength(255)]],
      groupTypeId: [null, Validators.required],
      listAttributes: this.fb.array([]),
      configs: this.fb.array([])
    });
    if (this.mode === Mode.ADD) {
      this.initConfigs();
    }
    this.attributesFormArray = this.form?.get('listAttributes') as FormArray;
  }

  get configs(): NzSafeAny {
    return this.form.controls[this.FORM_ARRAY_NAME] as FormArray;
  }

  initConfigs() {
    const controlsConfig: any = {};
    controlsConfig.organizationId = [null, [Validators.required]];
    controlsConfig.jobIds = [null];
    controlsConfig.orgTypeId = [null];
    const profile = this.fb.group(controlsConfig);
    this.configs.push(profile);
  }

  addNewConfigs() {
    this.isSubmitted = true;
    if (this.configs.valid) {
      this.initConfigs();
      this.isSubmitted = false;
    }
  }


  onDeleteConfigsClick(i: number) {
    if (this.configs.length > 1) {
      this.popupService.showModalConfirmDelete(() => {
        this.configs.removeAt(i);
      });
    } else {
      this.popupService.showModalConfirmDelete(() => {
        this.configs.removeAt(i);
        this.initConfigs();
      });
    }
  }

}
