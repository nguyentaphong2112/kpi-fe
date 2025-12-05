import { Component, Injector, OnInit } from '@angular/core';
import { HTTP_STATUS_CODE, MICRO_SERVICE } from '@core/constant/system.constants';
import { FunctionCode } from '@shared/enums/enums-constant';
import { Scopes } from '@core/utils/common-constants';
import { DataService } from '@shared/services/data.service';
import { AwardProcessModel } from '@app/modules/hrm/data-access/models/research/award-process.model';
import { CommonUtils } from '@shared/services/common-utils.service';
import { Mode, REQUEST_TYPE } from '@shared/constant/common';
import { FormArray, Validators } from '@angular/forms';
import { BaseFormComponent } from '@core/components/base-form.component';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { DateValidator } from '@shared/custom-validator/dateValidator.class';
import { UrlConstant } from '@app/modules/hrm/data-access/constant/url.class';
import { CategoriesService } from '@shared/services/categories.service';
import { CatalogModel } from '@shared/model/catalog-model';
import { distinctUntilChanged } from 'rxjs';
import { PoliticalParticipationsService } from '@app/modules/hrm/data-access/services/staff-research/political-participations.service';

@Component({
  selector: 'app-pon-form',
  templateUrl: './pon-form.component.html',
  styleUrls: ['./pon-form.component.scss']
})
export class PonFormComponent extends BaseFormComponent<NzSafeAny> implements OnInit {

  serviceName = MICRO_SERVICE.HRM;
  data: any;
  hiddenEmp = false;
  employeeId: number;
  functionCode = FunctionCode.HR_POLITICAL_PARTICIPATIONS;
  scope = Scopes.CREATE;
  listOrganizationType = [];
  listPositionTitle: CatalogModel[] = [];


  constructor(
    private readonly service: PoliticalParticipationsService,
    private categoryService: CategoriesService,
    private dataService: DataService,
    injector: Injector
  ) {
    super(injector);
    this.key = 'participationId';
    this.initDataSelected();
    this.findOneById = (id) => this.service.findOneById(id, this.config ?? `/${this.data.employeeId}`);
    this.createApi = (body: AwardProcessModel) => this.service.createOrImport(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.FORM_DATA, this.config ?? `/${this.f.employeeId.value}`);
    this.updateApi = (body: AwardProcessModel) => this.service.update(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.FORM_DATA, this.config ?? `/${this.f.employeeId.value}`);
    this.getConfigAttributeApi = () => this.dataService.getAttributeConfig({ tableName: 'hr_political_participations' });
    this.getConfigAttributes();
  }

  ngOnInit() {
    super.ngOnInit();
    this.employeeId = this.data?.employeeId;
    if (this.employeeId && this.mode === Mode.ADD) {
      this.form.controls.employeeId.setValue(this.employeeId);
    }
    this.hiddenEmp = this.data.hiddenEmp;
    this.changeOrganizationType();
  }

  override initForm() {
    this.form = this.fb.group({
      participationId: [null],
      employeeId: [null, [Validators.required]],
      organizationType: [null, [Validators.required]],
      startDate: [null, [Validators.required]],
      endDate: [null],
      positionTitle: [null, [Validators.required]],
      organizationName: [null, [Validators.required]],
      listAttributes: this.fb.array([])
    }, {
      validators: [DateValidator.validateRangeDate('startDate', 'endDate', 'rangeDateError')]
    });
    this.attributesFormArray = this.form?.get('listAttributes') as FormArray;
  }


  initDataSelected() {
    this.categoryService.getList({ isGetAttribute: true }, UrlConstant.CATEGORY.GET_CATEGORIES.replace('{typeCode}', this.categoryCode.LOAI_TO_CHUC_CTR_XH)).subscribe(res => {
      if (res.code === HTTP_STATUS_CODE.SUCCESS) {
        this.listOrganizationType = res.data;
      }
    });
  }


  changeOrganizationType() {
    this.subscriptions.push(
      this.f.organizationType.valueChanges.pipe(distinctUntilChanged()).subscribe(value => {
        this.listPositionTitle = [];
        this.f.positionTitle.setValue(null);
        if (value) {
          const url = UrlConstant.CATEGORY.GET_BY_PARENT.replace('{categoryType}', this.categoryCode.CHUC_DANH_CTR_XH);
          const params = {
            parentTypeCode: this.categoryCode.LOAI_TO_CHUC_CTR_XH,
            parentValue: value,
            isGetAttribute: true
          };
          this.dataService.getDataByParam(url, params, this.microService.ADMIN).subscribe(res => {
            if (res.code === HTTP_STATUS_CODE.SUCCESS) {
              this.listPositionTitle = res.data;
            }
          });
        }
      })
    );
  }

}
