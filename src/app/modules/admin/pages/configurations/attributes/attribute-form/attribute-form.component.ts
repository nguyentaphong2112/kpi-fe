import { Component, Injector, OnInit } from '@angular/core';
import { BaseFormComponent } from '@core/components/base-form.component';
import { MICRO_SERVICE } from '@core/constant/system.constants';
import { AttributeService } from '@app/modules/admin/data-access/services/configurations/attribute.service';
import { FormArray, Validators } from '@angular/forms';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { Constant } from '@app/modules/admin/data-access/constants/constant';
import { CategoryModel } from '@core/models/category-common.interface';
import { CommonUtils } from '@shared/services/common-utils.service';
import { UrlConstant } from '@app/modules/admin/data-access/constants/url.constant';
import { Mode, REQUEST_TYPE } from '@shared/constant/common';
import { ObjectUtil } from '@core/utils/object.util';

@Component({
  selector: 'app-attribute-form',
  templateUrl: './attribute-form.component.html',
  styleUrls: ['./attribute-form.component.scss']
})
export class AttributeFormComponent extends BaseFormComponent<NzSafeAny> implements OnInit {
  serviceName = MICRO_SERVICE.ADMIN;
  readonly FORM_ARRAY_NAME = 'attributes';
  listRequired: CategoryModel[] = [];
  listType: CategoryModel[] = [];
  constant = Constant;
  urlLoadTableData = UrlConstant.ATTRIBUTES.GET_LIST_TABLE_NAME;

  constructor(injector: Injector,
              private readonly attributeService: AttributeService
  ) {
    super(injector);
    this.initDataSelect();
    this.isConvertFindForm = false;
    this.findOneById = (id) => this.attributeService.findOneById(id);
    this.createApi = (body: any) => this.attributeService.createOrImport(body, REQUEST_TYPE.DEFAULT);
    this.updateApi = (body: any) => this.attributeService.update(body, REQUEST_TYPE.DEFAULT);
    this.key = 'configObjectAttributeId';
  }

  ngOnInit() {
    super.ngOnInit();
    this.patchValue();
  }

  override initForm() {
    this.form = this.fb.group({
      name: [null, [Validators.required, Validators.maxLength(255)]],
      tableName: [null, [Validators.required]],
      functionCode: [null, [Validators.maxLength(50)]],
      note: [null, Validators.maxLength(500)],
      attributes: this.fb.array([])
    });
    if (this.mode === Mode.ADD) {
      this.initAttributes(-1);
    }
  }

  patchValue() {
    if (this.data) {
      this.data.listAttributes.forEach((it, index) => {
        this.initAttributes(0);
        this.attributes.controls[index].setValue(it);
      });
    }
  }

  initDataSelect() {
    this.listRequired = ObjectUtil.optionsToList(this.constant.LIST_REQUIRED, this.translate);
    this.listType = ObjectUtil.optionsToList(this.constant.LIST_TYPE, this.translate);
  }

  get attributes(): NzSafeAny {
    return this.form.controls[this.FORM_ARRAY_NAME] as FormArray;
  }

  initAttributes(i: number) {
    const controlsConfig: any = {};
    controlsConfig.code = [null, [Validators.required, Validators.maxLength(50)]];
    controlsConfig.name = [null, [Validators.required, Validators.maxLength(255)]];
    controlsConfig.dataType = ['string', Validators.required];
    controlsConfig.required = [false, Validators.required];
    controlsConfig.urlApi = [''];
    controlsConfig.nzXs = [''];
    controlsConfig.nzLg = [''];

    const profile = this.fb.group(controlsConfig);

    // Assuming you want to store both the profile and the index (i)
    this.attributes.insert(i + 1, profile);
  }

  addNewAttributes(i: number) {
    this.isSubmitted = true;
    if (this.attributes.valid) {
      this.initAttributes(i);
      this.isSubmitted = false;
    }
  }


  onDeleteAttributesClick(i: number) {
    if (this.attributes.length > 1) {
      this.popupService.showModalConfirmDelete(() => {
        this.attributes.removeAt(i);
      });
    } else {
      this.popupService.showModalConfirmDelete(() => {
        this.attributes.removeAt(i);
        this.initAttributes(0);
      });
    }
  }


}
