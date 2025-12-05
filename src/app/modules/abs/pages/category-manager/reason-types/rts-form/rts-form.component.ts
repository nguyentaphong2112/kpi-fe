import {Component, Injector, OnInit} from '@angular/core';
import {Validators} from "@angular/forms";
import {ReasonTypesModel} from "../../../../data-access/models/category-manager/reason-types.model";
import {ReasonTypesService} from "../../../../data-access/services/category-manager/reason-types.service";
import {BaseFormComponent} from "@core/components/base-form.component";
import {HTTP_STATUS_CODE, MICRO_SERVICE} from "@core/constant/system.constants";
import {CommonUtils} from "@shared/services/common-utils.service";
import {REQUEST_TYPE} from "@shared/constant/common";
import {CategoryModel} from "@core/models/category-common.interface";
import {DataService} from "@shared/services/data.service";
import {WorkdayTypesService} from "@app/modules/abs/data-access/services/category-manager/workday-types.service";

@Component({
  selector: 'rts-form',
  templateUrl: './rts-form.component.html',
  styleUrls: ['./rts-form.component.scss']
})
export class RtsFormComponent extends BaseFormComponent<ReasonTypesModel> implements OnInit {
  serviceName = MICRO_SERVICE.ABS
  urlLoadData = '/reason-types'

  workdayType: CategoryModel[] = [];
  listTypeDate: CategoryModel[] = [];
  chooseYesNo :CategoryModel[] =[];

  constructor(
    private readonly service: ReasonTypesService,
    private readonly workdayTypesService: WorkdayTypesService,
    private dataService: DataService,
    injector: Injector
  ) {
    super(injector);
    this.key = 'reasonTypeId'

    this.findOneById = (id) => this.service.findOneById(id);
    this.createApi = (body: ReasonTypesModel) => this.service.createOrImport(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.DEFAULT);
    this.updateApi = (body: ReasonTypesModel) => this.service.update(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.DEFAULT);
  }

  ngOnInit() {
    super.ngOnInit();
    this.getWorkdayType();
    this.getListTypeDate();
    this.getChooseYesNo();
  }

  override initForm() {
    this.form = this.fb.group({
      reasonTypeId: [null],
      code: [null, [Validators.required, Validators.maxLength(255)]],
      name: [null, [Validators.required, Validators.maxLength(255)]],
      workdayTypeId: [null, [Validators.required]],      
      isOverHoliday: [null, [Validators.required]],
    },
    {validators:
        []
    });
  }


  getWorkdayType() {
    this.subscriptions.push(
      this.workdayTypesService.getData().subscribe(res => {
        if (res.code === HTTP_STATUS_CODE.SUCCESS) {
          this.workdayType = res.data;
        }
      })
    );
  }
  getChooseYesNo() {
    this.subscriptions.push(
      this.dataService.getData(this.getUrlCategory(this.categoryCode.CHOOSE_YES_NO), this.microService.ADMIN, true).subscribe(res => {
        if (res.code === HTTP_STATUS_CODE.SUCCESS) {
          this.chooseYesNo = res.data;
        }
      })
    );
  }
  getListTypeDate() {
    this.subscriptions.push(
      this.dataService.getData(this.getUrlCategory(this.categoryCode.THOI_GIAN_NGHI), this.microService.ADMIN, true).subscribe(res => {
        if (res.code === HTTP_STATUS_CODE.SUCCESS) {
          this.listTypeDate = res.data;
        }
      })
    );
  }

}


