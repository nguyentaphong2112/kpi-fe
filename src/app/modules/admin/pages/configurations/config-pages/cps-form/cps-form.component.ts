import {Component, Injector, OnInit} from '@angular/core';
import {FormArray, Validators} from "@angular/forms";
import {ConfigPagesModel} from "../../../../data-access/models/configurations/config-pages.model";
import {ConfigPagesService} from "../../../../data-access/services/configurations/config-pages.service";
import {BaseFormComponent} from "@core/components/base-form.component";
import {DateValidator} from "@shared/custom-validator/dateValidator.class";
import {MICRO_SERVICE} from "@core/constant/system.constants";
import {CommonUtils} from "@shared/services/common-utils.service";
import {Mode, REQUEST_TYPE} from "@shared/constant/common";
import {NzSafeAny} from "ng-zorro-antd/core/types";
import {UrlConstant} from "@app/modules/admin/data-access/constants/url.constant";
import {DynamicReportService} from "@app/modules/admin/data-access/services/configurations/dynamic-report.service";
import {DataService} from "@shared/services/data.service";
import {ObjectUtil} from "@core/utils/object.util";
import {Constant} from "@app/modules/admin/data-access/constants/constant";
import {distinctUntilChanged} from "rxjs";

@Component({
  selector: 'cps-form',
  templateUrl: './cps-form.component.html',
  styleUrls: ['./cps-form.component.scss']
})
export class CpsFormComponent extends BaseFormComponent<ConfigPagesModel> implements OnInit {

  serviceName = MICRO_SERVICE.ADMIN
  urlLoadData = '/config-pages'
  listConfigPageType: NzSafeAny[] = [];

  constructor(
    private readonly service: ConfigPagesService,
    private readonly  dynamicReportService: DynamicReportService,
    private readonly dataService: DataService,
    injector: Injector
  ) {
    super(injector);
    this.isPage = false;
    this.key = 'configPageId'
    this.listConfigPageType = ObjectUtil.optionsToList(Constant.LIST_CONFIG_PAGE_TYPE,this.translate);
    this.findOneById = (id) => this.service.findOneById(id);
    this.createApi = (body: ConfigPagesModel) => this.service.createOrImport(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.DEFAULT);
    this.updateApi = (body: ConfigPagesModel) => this.service.update(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.DEFAULT);
  }

  override initForm() {
    this.form = this.fb.group({
        configPageId: [null],
        url: [null, [Validators.required, Validators.maxLength(255)]],
        reportCodes: [null, [Validators.maxLength(5000)]],
        type:[null,[Validators.required]],
        fileList: [null],
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
    this.onChangeType()
  }


  beforePatchValue() {
    super.beforePatchValue();
    if (this.data && typeof this.data.reportCodes === 'string') {
      // Convert the comma-separated string into an array
      this.data.reportCodes = this.data.reportCodes.split(',').map(item => item.trim());
    }

  }

  beforeSave() {
    super.beforeSave();
    if (Array.isArray(this.body.reportCodes)) {
      this.body.reportCodes = this.body.reportCodes.join(',');
    }
  }


  onChangeType() {
    this.subscriptions.push(
      this.f.type.valueChanges?.pipe(distinctUntilChanged()).subscribe(value => {
        if (value) {
          this.attributesFormArray.clear()
          this.getConfigAttributeApi = () => this.dataService.getAttributeConfig({
            tableName: 'sys_config_pages',
            functionCode:value
          });
          this.getConfigAttributes(true)
        } else {
          this.attributesFormArray.clear()
        }
      })
    );

  }


}