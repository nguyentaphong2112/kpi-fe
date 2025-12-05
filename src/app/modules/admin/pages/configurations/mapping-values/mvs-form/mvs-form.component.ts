import {ChangeDetectorRef, Component, Injector, OnInit} from '@angular/core';
import {Validators} from "@angular/forms";
import {MappingValuesModel} from "../../../../data-access/models/configurations/mapping-values.model";
import {MappingValuesService} from "../../../../data-access/services/configurations/mapping-values.service";
import {BaseFormComponent} from "@core/components/base-form.component";
import {DateValidator} from "@shared/custom-validator/dateValidator.class";
import {MICRO_SERVICE} from "@core/constant/system.constants";
import {CommonUtils} from "@shared/services/common-utils.service";
import {REQUEST_TYPE} from "@shared/constant/common";
import {CategoriesModel} from "@app/modules/admin/data-access/models/categories/categories.model";

@Component({
  selector: 'mvs-form',
  templateUrl: './mvs-form.component.html',
  styleUrls: ['./mvs-form.component.scss']
})
export class MvsFormComponent extends BaseFormComponent<MappingValuesModel> implements OnInit {

  serviceName = MICRO_SERVICE.ADMIN;
  urlLoadData = '/mapping-values';
  dataConfigMappingSelect:any;
  constructor(
    private readonly service: MappingValuesService,
    injector: Injector
  ) {
    super(injector);
    this.key = 'mappingValueId'

    this.findOneById = (id) => this.service.findOneById(id, `/${this.data.dataConfigMappingSelect?.code}`);
    this.createApi = (body: CategoriesModel) => this.service.createOrImport(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.DEFAULT, `/${this.body?.configMappingCode}`);
    this.updateApi = (body: CategoriesModel) => this.service.update(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.DEFAULT, `/${this.body?.configMappingCode}`);
  }

  ngOnInit() {
    this.dataConfigMappingSelect = this.data?.dataConfigMappingSelect;
    super.ngOnInit();
  }




  override initForm() {
    this.form = this.fb.group({
      mappingValueId: [null],
      parameter: [null, [Validators.required, Validators.maxLength(255)]],
      value: [null, [Validators.required, Validators.maxLength(255)]],
      startDate: [null, [Validators.required]],
      endDate: [null],
      configMappingCode: this.data?.dataConfigMappingSelect?.code ?? '',

    },
    {validators:
        [DateValidator.validateRangeDate('startDate', 'endDate', 'rangeDateError')]
    });
  }
}


