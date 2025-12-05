import {Component, Injector, OnInit} from '@angular/core';
import {AbstractControl, FormArray, ValidatorFn, Validators} from "@angular/forms";
import {ProductsModel} from "../../../../data-access/models/category-managers/products.model";
import {ProductsService} from "../../../../data-access/services/category-managers/products.service";
import {BaseFormComponent} from "@core/components/base-form.component";
import {DateValidator} from "@shared/custom-validator/dateValidator.class";
import {MICRO_SERVICE} from "@core/constant/system.constants";
import {CommonUtils} from "@shared/services/common-utils.service";
import {REQUEST_TYPE} from "@shared/constant/common";
import {DataService} from "@shared/services/data.service";

@Component({
  selector: 'products-form',
  templateUrl: './products-form.component.html',
  styleUrls: ['./products-form.component.scss']
})
export class ProductsFormComponent extends BaseFormComponent<ProductsModel> implements OnInit {

  serviceName = MICRO_SERVICE.CRM
  urlLoadData = '/products'
  constructor(
    private readonly service: ProductsService,
    private dataService: DataService,
    injector: Injector
  ) {
    super(injector);
    this.key = 'productId'
    this.findOneById = (id) => this.service.findOneById(id);
    this.createApi = (body: ProductsModel) => this.service.createOrImport(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.DEFAULT);
    this.updateApi = (body: ProductsModel) => this.service.update(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.DEFAULT);

    this.getConfigAttributeApi = () => this.dataService.getAttributeConfig({
      tableName: 'crm_products',
    });
    this.getConfigAttributes();
  }

  override initForm() {
    this.form = this.fb.group({
      productId: [null],
      code: [null, [Validators.required, Validators.maxLength(50), this.noSpecialCharactersValidator()]],
      name: [null, [Validators.required, Validators.maxLength(255)]],
      unitId: [null, [ Validators.maxLength(10)]],
      unitPrice: [null],
      categoryId: [null,[Validators.maxLength(20)]],
      statusId:[null],
      listAttributes: this.fb.array([]),

    },
    {validators:
        []
    });
    this.attributesFormArray = this.form?.get('listAttributes') as FormArray;
  }

  noSpecialCharactersValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const forbidden = /[^a-zA-Z0-9_]/.test(control.value);
      return forbidden ? { 'specialChars': { value: control.value } } : null;
    };
  }
}


