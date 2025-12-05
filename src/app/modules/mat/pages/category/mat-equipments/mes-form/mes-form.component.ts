import {Component, Injector, OnInit} from '@angular/core';
import {Validators} from '@angular/forms';
import {MatEquipmentsModel} from '../../../../data-access/models/category/mat-equipments.model';
import {MatEquipmentsService} from '../../../../data-access/services/category/mat-equipments.service';
import {BaseFormComponent} from '@core/components/base-form.component';
import {MICRO_SERVICE} from '@core/constant/system.constants';
import {CommonUtils} from '@shared/services/common-utils.service';
import {REQUEST_TYPE} from '@shared/constant/common';

@Component({
  selector: 'mes-form',
  templateUrl: './mes-form.component.html',
  styleUrls: ['./mes-form.component.scss']
})
export class MesFormComponent extends BaseFormComponent<MatEquipmentsModel> implements OnInit {

  serviceName = MICRO_SERVICE.MAT;
  urlLoadData = '/mat-equipments';
  constructor(
    private readonly service: MatEquipmentsService,
    injector: Injector
  ) {
    super(injector);
    this.key = 'equipmentId';

    this.findOneById = (id) => this.service.findOneById(id);
    this.createApi = (body: MatEquipmentsModel) => this.service.createOrImport(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.DEFAULT);
    this.updateApi = (body: MatEquipmentsModel) => this.service.update(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.DEFAULT);
  }

  beforePatchValue() {
    super.beforePatchValue();
    this.data.isSerialChecking = this.data.isSerialChecking === 'Y';
  }

  override initForm() {
    this.form = this.fb.group({
      equipmentId: [null],
      name: [null, [Validators.required, Validators.maxLength(255)]],
      equipmentGroupId: [null, [Validators.required]],
      equipmentTypeId: [null, [Validators.required]],
      equipmentUnitId: [null, [Validators.required]],
      warningDays: [null],
      isSerialChecking: [false],
      serialNo: [null, [Validators.maxLength(255)]],
      unitPrice: [null, [Validators.required]],
      note: [null, [Validators.maxLength(500)]],
      code: [null, [Validators.required, Validators.maxLength(50)]],
      description: [null, [Validators.maxLength(500)]],
      location: [null, [Validators.maxLength(255)]],
    });
  }
}


