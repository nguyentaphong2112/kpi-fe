import {AfterViewInit, Component, Injector, OnInit, ViewChild} from '@angular/core';
import {Validators} from '@angular/forms';
import {MatInventoryAdjustmentsModel} from '../../../../data-access/models/inventory/mat-inventory-adjustments.model';
import {MatInventoryAdjustmentsService} from '../../../../data-access/services/inventory/mat-inventory-adjustments.service';
import {BaseFormComponent} from '@core/components/base-form.component';
import {DateValidator} from '@shared/custom-validator/dateValidator.class';
import {MICRO_SERVICE} from '@core/constant/system.constants';
import {CommonUtils} from '@shared/services/common-utils.service';
import {REQUEST_TYPE} from '@shared/constant/common';
import {
  EquipmentListComponent
} from '@app/modules/mat/pages/inventory/mat-inventory-adjustments/mia-form/equipment-list/equipment-list.component';

@Component({
  selector: 'mia-form',
  templateUrl: './mia-form.component.html',
  styleUrls: ['./mia-form.component.scss']
})
export class MiaFormComponent extends BaseFormComponent<MatInventoryAdjustmentsModel> implements OnInit, AfterViewInit {

  @ViewChild(EquipmentListComponent) equipmentList: EquipmentListComponent;

  serviceName = MICRO_SERVICE.MAT;
  urlLoadData = '/equipments/search/list';
  constructor(
    private readonly service: MatInventoryAdjustmentsService,
    injector: Injector
  ) {
    super(injector);
    this.key = 'inventoryAdjustmentId';
    this.findOneById = (id) => this.service.findOneById(id);
    this.createApi = (body: MatInventoryAdjustmentsModel) => this.service.createOrImport(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.FORM_DATA);
    this.updateApi = (body: MatInventoryAdjustmentsModel) => this.service.update(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.FORM_DATA);
  }

  override initForm() {
    this.form = this.fb.group({
      isSendToApprove: ['N'],
      inventoryAdjustmentId: [null],
      warehouseId: [null, [Validators.required]],
      startDate: [null, [Validators.required]],
      endDate: [null, [Validators.required]],
      inventoryAdjustmentNo: [null, [Validators.required]],
      checkedEmployeeId: [null, [Validators.required]],
      note: [null],
      approvedName: [null],
      type: [null, [Validators.required]],
      approvedTime: [null],
      approvedNote: [null],
      statusId: [null],
      hasApproveAdjustment: [null],
      files: [null],
      docIdsDelete: [[]],
      listEquipmentIds: [null, [Validators.required]]
    },
    {validators:
        [DateValidator.validateRangeDate('startDate', 'endDate', 'rangeDateError')]
    });
  }

  ngAfterViewInit() {
    if (this.mode === this.modeConst.ADD) {
      this.service.getData(null, '/get-seq').subscribe(res => {
        this.f.inventoryAdjustmentNo.setValue('QLVTTH_PKK_' + String(res.data).padStart(6, '0'));
      });
    }
  }

  beforePatchValue() {
    super.beforePatchValue();
    this.data.listEquipmentIds = this.data.listEquipments.map(el => el.equipmentId);
    this.data.files = this.convertFileToForm(this.data.files);
    this.equipmentList.tableData = this.data.listEquipments;
  }

  selectEquipments(equipments: any) {
    const listItemSelected = JSON.parse(JSON.stringify(equipments.listItemSelected));
    const eqList = this.equipmentList.tableData.filter(el => equipments.listOfSelected.includes(el.equipmentId));
    const eqChange = listItemSelected.filter(el => !eqList.map(e => e.equipmentId).includes(el.equipmentId));
    this.equipmentList.tableData = [...eqList, ...eqChange.map(el => ({...el, quantity: 0}))];
  }

  override beforeSave() {
    super.beforeSave();
    this.body.listEquipments = this.equipmentList.tableData;
    this.body.docIdsDelete = this.docIdsDelete;
  }

  listEquipmentIdsChange(listEquipmentIds: number[]) {
    this.f.listEquipmentIds.setValue(listEquipmentIds);
  }

  clearEquipment() {
    this.f.listEquipmentIds.setValue(null);
    this.equipmentList.tableData = [];
  }


  doImportData() {
    this.isImportData = true;
  }
  isImportData = false;
  fileTemplateName = 'templateImport.xlsx';
  importApi = (body) => this.service.createOrImport(body, REQUEST_TYPE.DEFAULT, '/import-equipments');
  downLoadTemplateApi = () => this.service.downloadFile('/import-equipments-template', { warehouseId: this.form.controls['warehouseId'].value });
  doDownloadFileByNameApi = (url: string) => this.service.downloadFile(url);
  doCloseImport() {
    this.isImportData = false;
  }

  updateList(res: any) {
    console.log(res)
  }
}


