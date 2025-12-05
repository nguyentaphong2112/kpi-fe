import {Component, Injector, OnInit} from '@angular/core';
import {Validators} from "@angular/forms";
import {ConfigMappingsModel} from "../../../../data-access/models/configurations/config-mappings.model";
import {ConfigMappingsService} from "../../../../data-access/services/configurations/config-mappings.service";
import {BaseFormComponent} from "@core/components/base-form.component";
import {DateValidator} from "@shared/custom-validator/dateValidator.class";
import {MICRO_SERVICE} from "@core/constant/system.constants";
import {CommonUtils} from "@shared/services/common-utils.service";
import {REQUEST_TYPE} from "@shared/constant/common";
import {ObjectUtil} from "@core/utils/object.util";

@Component({
  selector: 'cms-form',
  templateUrl: './cms-form.component.html',
  styleUrls: ['./cms-form.component.scss']
})
export class CmsFormComponent extends BaseFormComponent<ConfigMappingsModel> implements OnInit {

  serviceName = MICRO_SERVICE.ADMIN
  urlLoadData = '/config-mappings'
  LIST_TYPE = [
    { value: 'string', label: 'admin.configurations.attributes.label.string' },
    { value: 'int', label: 'admin.configurations.attributes.label.long' },
    { value: 'double', label: 'admin.configurations.attributes.label.double' },
    { value: 'date', label: 'admin.configurations.attributes.label.date' },
  ];
  listDataType:any[];
  constructor(
    private readonly service: ConfigMappingsService,
    injector: Injector
  ) {
    super(injector);
    this.key = 'configMappingId'
    this.initDataSelect();
    this.findOneById = (id) => this.service.findOneById(id);
    this.createApi = (body: ConfigMappingsModel) => this.service.createOrImport(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.DEFAULT);
    this.updateApi = (body: ConfigMappingsModel) => this.service.update(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.DEFAULT);
  }

  initDataSelect(){
    this.listDataType = ObjectUtil.optionsToList(this.LIST_TYPE,this.translate);
  }

  override initForm() {
    this.form = this.fb.group({
      configMappingId: [null],
      code: [null, [Validators.required, Validators.maxLength(255)]],
      name: [null, [Validators.required, Validators.maxLength(255)]],
      parameterTitle: [null, [Validators.required, Validators.maxLength(255)]],
      valueTitle: [null, [Validators.required, Validators.maxLength(255)]],
      dataType: [null, [Validators.required]],

    },
    {validators:
        []
    });
  }
}


