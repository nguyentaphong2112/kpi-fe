import {Component, Injector, OnInit} from '@angular/core';
import {AbstractControl, FormArray, FormGroup, ValidationErrors, ValidatorFn, Validators} from "@angular/forms";
import {ConfigChartsModel} from "../../../../data-access/models/configurations/config-charts.model";
import {ConfigChartsService} from "../../../../data-access/services/configurations/config-charts.service";
import {BaseFormComponent} from "@core/components/base-form.component";
import {DateValidator} from "@shared/custom-validator/dateValidator.class";
import {MICRO_SERVICE} from "@core/constant/system.constants";
import {CommonUtils} from "@shared/services/common-utils.service";
import {REQUEST_TYPE} from "@shared/constant/common";
import {ObjectUtil} from "@core/utils/object.util";
import {Constant} from "@app/modules/admin/data-access/constants/constant";
import {DataService} from "@shared/services/data.service";
import {debounceTime} from "rxjs";

@Component({
  selector: 'ccs-form',
  templateUrl: './ccs-form.component.html',
  styleUrls: ['./ccs-form.component.scss']
})
export class CcsFormComponent extends BaseFormComponent<ConfigChartsModel> implements OnInit {

  serviceName = MICRO_SERVICE.ADMIN
  urlLoadData = '/config-charts'
  listService = ObjectUtil.optionsToList(Constant.LIST_SERVICE)
  private activeField: string | null = null;
  constructor(
    private readonly service: ConfigChartsService,
    private readonly dataService: DataService,
    injector: Injector
  ) {
    super(injector);
    this.key = 'configChartId'

    this.findOneById = (id) => this.service.findOneById(id);
    this.createApi = (body: ConfigChartsModel) => this.service.createOrImport(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.DEFAULT);
    this.updateApi = (body: ConfigChartsModel) => this.service.update(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.DEFAULT);
    this.getConfigAttributeApi = () => this.dataService.getAttributeConfig({
      tableName: 'sys_config_charts',
      functionCode: null
    });
    this.getConfigAttributes()
  }

  override initForm() {
    this.form = this.fb.group({
      configChartId: [null],
      code: [null, [Validators.required, Validators.maxLength(255)]],
      name: [null, [Validators.required, Validators.maxLength(255)]],
      type: [null, [Validators.required]],
      sqlQuery: [null, [Validators.required]],
      url: [null, [Validators.required, Validators.maxLength(255)]],
      serviceName: [null, [Validators.required]],
      orderNumber: [null],
      listAttributes: this.fb.array([]),
    },
    {validators:
        [this.validateTwoField('sqlQuery','url','exclusiveField')]
    });
    this.attributesFormArray = this.form?.get('listAttributes') as FormArray;
  }

  validateTwoField(field1Name: string, field2Name: string, errorKey: string): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {

      const field1 = formGroup.get(field1Name);
      const field2 = formGroup.get(field2Name);

      const field1Value = field1?.value;
      const field2Value = field2?.value;

      if (!field1 || !field2) {
        return null;
      }

      if (field1Value && field2Value) {
        const errors = { [errorKey]: true }
        field2.setErrors(errors);
        return errors
      }

      // Determine which field is now active
      const newActiveField = field1Value ? field1Name : field2Value ? field2Name : null;

      // Only proceed if active field changed
      if (newActiveField !== this.activeField) {
        this.activeField = newActiveField;

        if (field1Value) {
          // Field1 has value - make Field2 optional
          field2.setValidators(null);
          field2.setErrors(null);
        }
        else if (field2Value) {
          // Field2 has value - make Field1 optional
          field1.setValidators(null);
          field1.setErrors(null);
        }
        else {
          // Both empty - restore required validators
          field1.setValidators(Validators.required);
          field2.setValidators(Validators.required);
        }

        // Update validity without emitting events
        field1.updateValueAndValidity({ emitEvent: false });
        field2.updateValueAndValidity({ emitEvent: false });
      }

      return null;
    };
  }

  protected readonly Validators = Validators;
}



