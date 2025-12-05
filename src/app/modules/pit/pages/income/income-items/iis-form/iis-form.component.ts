import {Component, Injector, OnInit} from '@angular/core';
import {FormGroup, Validators} from "@angular/forms";
import {IncomeItemsModel} from "../../../../data-access/models/income/income-items.model";
import {IncomeItemsService} from "../../../../data-access/services/income/income-items.service";
import {BaseFormComponent} from "@core/components/base-form.component";
import {MICRO_SERVICE, SYSTEM_FORMAT_DATA} from "@core/constant/system.constants";
import {CommonUtils} from "@shared/services/common-utils.service";
import {REQUEST_TYPE} from "@shared/constant/common";
import {Utils} from "@core/utils/utils";
import {UrlConstant} from "@app/modules/abs/data-access/constant/url.class";
import {IncomeTemplateService} from "@app/modules/pit/data-access/services/income/income-template.service";
import {SelectModal} from "@shared/component/hbt-select/select.component";

@Component({
  selector: 'iis-form',
  templateUrl: './iis-form.component.html',
  styleUrls: ['./iis-form.component.scss']
})
export class IisFormComponent extends BaseFormComponent<IncomeItemsModel> implements OnInit {

  serviceName = MICRO_SERVICE.PIT
  urlLoadData = '/income-items'
  listIncomeTemplate: any;
  constructor(
    private readonly service: IncomeItemsService,
    private readonly templateService: IncomeTemplateService,
    injector: Injector
  ) {
    super(injector);
    this.isPage = false;
    this.key = 'incomeItemId'

    this.findOneById = (id) => this.service.findOneById(id);
    this.createApi = (body: IncomeItemsModel) => this.service.createOrImport(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.DEFAULT);
    this.updateApi = (body: IncomeItemsModel) => this.service.update(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.DEFAULT);
  }

  override ngOnInit() {
    super.ngOnInit();
    this.getIncomeTemplate();
    this.initForm();
    this.initData();
    this.clearValidators();
  }

  override initForm() {
    this.form = this.fb.group({
      incomeTemplateId: [null, [Validators.required]],
      salaryPeriodDate: [null, [Validators.required]],
      code: [null],
      name: [null, [Validators.required]],
    });
  }

  onChangeTypeTemplate(event: SelectModal) {
    if (this.listIncomeTemplate) {
      const selectedTemplate = this.listIncomeTemplate.find(item => item.incomeTemplateId === event?.itemSelected?.incomeTemplateId);
      if (selectedTemplate) {
        this.f?.code?.setValue(selectedTemplate.code);
      }
    }
  }

  createConfigsForm(data: any): FormGroup {
    return this.fb?.group({
      configName: [data.configName],
      configCode: [data.configCode],
      dataType: [data.dataType?.toUpperCase()],
      isRequired: [data.required],
      urlLoadData: [data.urlLoadData],
      configValue: [data.configValue, data?.required ? [Validators.required] : []]
    });
  }

  override afterPatchValue() {
    if (this.attributesFormArray?.length > 0) {
      while (this.attributesFormArray?.length !== 0) {
        this.attributesFormArray?.removeAt(0);
      }
    }
    this.listAttributeConfig?.forEach(item => {
      const attributeData = this.data[this.keyAttributeData]?.find(v => v.configCode?.toLowerCase() === item.configCode?.toLowerCase());
      item.configValue = attributeData ? attributeData.configValue : null;
      if (item.dataType?.toUpperCase() === 'DATE') {
        item.configValue = Utils.convertDateToFillForm(item.configValue);
      }
      this.attributesFormArray?.push(this.createConfigsForm(item));
    });
  }


  patchValueInfo() {
    this.data.salaryPeriodDate = Utils.convertDateToFillForm(this.data.salaryPeriodDate, SYSTEM_FORMAT_DATA.MONTH_TIME_FORMAT);
    this.form.patchValue(this.data);
  }

  getIncomeTemplate() {
    this.templateService.getAll('/get-all')
      .subscribe(res => {
        this.listIncomeTemplate = res.data;
      });
  }

  protected readonly urlConstant = UrlConstant;
  public readonly microService = MICRO_SERVICE;

}


