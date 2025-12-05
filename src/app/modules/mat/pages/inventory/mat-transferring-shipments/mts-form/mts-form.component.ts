import {AfterViewInit, Component, Injector, OnInit, ViewChild} from '@angular/core';
import {Validators} from '@angular/forms';
import {MatTransferringShipmentsModel} from '../../../../data-access/models/inventory/mat-transferring-shipments.model';
import {MatTransferringShipmentsService} from '../../../../data-access/services/inventory/mat-transferring-shipments.service';
import {BaseFormComponent} from '@core/components/base-form.component';
import {MICRO_SERVICE} from '@core/constant/system.constants';
import {CommonUtils} from '@shared/services/common-utils.service';
import {REQUEST_TYPE} from '@shared/constant/common';
import {distinctUntilChanged} from 'rxjs';
import {MatWarehousesService} from '@app/modules/mat/data-access/services/category/mat-warehouses.service';
import {
  EquipmentListComponent
} from '@app/modules/mat/pages/inventory/mat-transferring-shipments/mts-form/equipment-list/equipment-list.component';

@Component({
  selector: 'mts-form',
  templateUrl: './mts-form.component.html',
  styleUrls: ['./mts-form.component.scss']
})
export class MtsFormComponent extends BaseFormComponent<MatTransferringShipmentsModel> implements OnInit, AfterViewInit {

  @ViewChild(EquipmentListComponent) equipmentList: EquipmentListComponent;

  serviceName = MICRO_SERVICE.MAT;
  urlLoadData = '/equipments/search/list';
  listWarehouse: Array<any> = [];
  listWarehouseReceived: Array<any> = [];
  constructor(
    private readonly service: MatTransferringShipmentsService,
    private readonly warehouseService: MatWarehousesService,
    injector: Injector
  ) {
    super(injector);
    this.key = 'transferringShipmentId';
    this.findOneById = (id) => this.service.findOneById(id);
    this.createApi = (body: MatTransferringShipmentsModel) => this.service.createOrImport(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.FORM_DATA);
    this.updateApi = (body: MatTransferringShipmentsModel) => this.service.update(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.FORM_DATA);

    this.initDataSelect();
  }

  override initForm() {
    this.form = this.fb.group({
      isSendToApprove: ['N'],
      transferringShipmentId: [null],
      pickingNo: [null, [Validators.required]],
      transferringDate: [null, [Validators.required]],
      name: [null, [Validators.required]],
      createdEmployeeId: [null, [Validators.required]],
      warehouseId: [null, [Validators.required]],
      receivedWarehouseId: [null, [Validators.required]],
      transferredEmployeeId: [null, [Validators.required]],
      receivedEmployeeId: [null, [Validators.required]],
      note: [null],
      statusId: [null],
      type: [null],
      approvedTime: [null],
      approvedName: [null],
      approvedNote: [null],
      hasApproveTransfer: [null],
      incomingPickingNo: [null],
      outgoingPickingNo: [null],
      files: [null],
      listEquipmentIds: [null, [Validators.required]],
    });
  }

  beforePatchValue() {
    super.beforePatchValue();
    this.data.listEquipmentIds = this.data.listEquipments.map(el => el.equipmentId);
    this.data.files = this.convertFileToForm(this.data.files);
    this.equipmentList.tableData = this.data.listEquipments;
  }

  ngAfterViewInit() {
    this.form.controls.warehouseId.valueChanges?.pipe(distinctUntilChanged()).subscribe(value => {
      this.listWarehouseReceived.forEach(it =>
        it.disable = value == it.warehouseId
      );
    });

    this.form.controls.receivedWarehouseId.valueChanges?.pipe(distinctUntilChanged()).subscribe(value => {
      this.listWarehouse.forEach(it => it.disable = value == it.warehouseId);
    });
    if (this.mode === this.modeConst.ADD) {
      this.service.getData(null, '/get-seq').subscribe(res => {
        this.f.pickingNo.setValue('QLVTTH_PDC_' + String(res.data).padStart(6, '0'));
      });
    }
  }

  initDataSelect() {
    if (this.mode == this.modeConst.VIEW) {
      this.warehouseService.getList(null).subscribe(res => {
        this.listWarehouse = res.data;
        this.listWarehouseReceived = res.data;
      });
    } else {
      this.warehouseService.getList({
        isUserLogin: 'Y',
        isActive: 'Y'
      }).subscribe(res => {
        this.listWarehouse = res.data;
      });
      this.warehouseService.getList({ isActive: 'Y' }).subscribe(res => {
        this.listWarehouseReceived = res.data;
      });
    }
  }

  selectEquipments(equipments: any) {
    const listItemSelected = JSON.parse(JSON.stringify(equipments.listItemSelected));
    const eqList = this.equipmentList.tableData.filter(el => equipments.listOfSelected.includes(el.equipmentId));
    const eqChange = listItemSelected.filter(el => !eqList.map(e => e.equipmentId).includes(el.equipmentId));
    this.equipmentList.tableData = [...eqList, ...eqChange];
  }

  override beforeSave() {
    super.beforeSave();
    this.body.listEquipments = this.equipmentList.tableData;
    this.body.docIdsDelete = this.docIdsDelete;
  }

  listEquipmentIdsChange(listEquipmentIds: number[]) {
    this.f.listEquipmentIds.setValue(listEquipmentIds);
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


