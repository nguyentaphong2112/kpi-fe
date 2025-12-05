import {AfterViewInit, Component, Injector, OnInit, ViewChild} from '@angular/core';
import { Validators } from '@angular/forms';
import { MatIncomingShipmentsModel } from '../../../../data-access/models/inventory/mat-incoming-shipments.model';
import { MatIncomingShipmentsService } from '../../../../data-access/services/inventory/mat-incoming-shipments.service';
import { BaseFormComponent } from '@core/components/base-form.component';
import { MICRO_SERVICE } from '@core/constant/system.constants';
import { CommonUtils } from '@shared/services/common-utils.service';
import { REQUEST_TYPE } from '@shared/constant/common';
import { DateValidator } from '@shared/custom-validator/dateValidator.class';
import { MatWarehousesService } from '@app/modules/mat/data-access/services/category/mat-warehouses.service';
import { distinctUntilChanged } from 'rxjs';
import {
  MatTransferringShipmentsService
} from '@app/modules/mat/data-access/services/inventory/mat-transferring-shipments.service';
import {
  EquipmentListComponent
} from '@app/modules/mat/pages/inventory/mat-incoming-shipments/mis-form/equipment-list/equipment-list.component';

@Component({
  selector: 'mis-form',
  templateUrl: './mis-form.component.html',
  styleUrls: ['./mis-form.component.scss']
})
export class MisFormComponent extends BaseFormComponent<MatIncomingShipmentsModel> implements OnInit, AfterViewInit {

  @ViewChild(EquipmentListComponent) equipmentList: EquipmentListComponent;

  serviceName = MICRO_SERVICE.MAT;
  urlLoadData = '/equipments/search/list';
  isChecked = true;
  listWarehouse: Array<any> = [];
  listWarehouseTransfer: Array<any> = [];

  constructor(
    private readonly service: MatIncomingShipmentsService,
    private matTransferringShipmentsService: MatTransferringShipmentsService,
    private readonly warehouseService: MatWarehousesService,
    injector: Injector
  ) {
    super(injector);
    this.key = 'incomingShipmentId';
    this.findOneById = (id) => this.service.findOneById(id);
    this.createApi = (body: MatIncomingShipmentsModel) => this.service.createOrImport(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.FORM_DATA);
    this.updateApi = (body: MatIncomingShipmentsModel) => this.service.update(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.FORM_DATA);
  }

  override initForm() {
    this.form = this.fb.group({
      isSendToApprove: ['N'],
      incomingShipmentId: [null],
      warehouseId: [null, [Validators.required]],
      incomingDate: [null, [Validators.required]],
      pickingNo: [null, [Validators.required]],
      pickingEmployeeId: [null, [Validators.required]],
      authorId: [null, [Validators.required]],
      contractNo: [null, [Validators.required]],
      partnerName: [null],
      invoiceId: [null],
      shippedBy: [null],
      note: [null],
      statusId: [null],
      type: [null],
      outgoingWarehouseId: [null],
      outgoingTransferPickingNo: [null],
      approvedTime: [null],
      approvedName: [null],
      approvedNote: [null],
      hasApproveImport: [null],
      contractAmount: [null, [Validators.required]],
      files: [null],
      transferPickingNo: [null, [Validators.required]],
      transferWarehouseId: [null, [Validators.required]],
      transferredDate: [null, [Validators.required]],
      receiverId: [null, [Validators.required]],
      listEquipmentIds: [null, [Validators.required]]
    }, {
      validators:
        [DateValidator.validateRangeDate('incomingDate', 'transferredDate', 'rangeDateError')]
    });
  }

  ngAfterViewInit() {
    this.initDataSelect();
    this.form.controls.warehouseId.valueChanges?.pipe(distinctUntilChanged()).subscribe(value => {
      this.listWarehouseTransfer.forEach(it =>
        it.disable = value == it.warehouseId
      );
    });

    this.form.controls.transferWarehouseId.valueChanges?.pipe(distinctUntilChanged()).subscribe(value => {
      this.listWarehouse.forEach(it => it.disable = value == it.warehouseId);
    });
    if (this.mode === this.modeConst.ADD) {
      this.service.getData(null, '/get-seq').subscribe(res => {
        this.f.pickingNo.setValue('QLVTTH_PNK_' + String(res.data).padStart(6, '0'));
      });
      this.matTransferringShipmentsService.getData(null, '/get-seq').subscribe(res => {
        this.f.transferPickingNo.setValue('QLVTTH_PDC_' + String(res.data).padStart(6, '0'));
      });
    }
  }

  beforePatchValue() {
    super.beforePatchValue();
    this.data.listEquipmentIds = this.data.listEquipments.map(el => el.equipmentId);
    this.data.files = this.convertFileToForm(this.data.files);
    this.equipmentList.tableData = this.data.listEquipments;
    this.isChecked = !!this.data.transferWarehouseId;
    if (!this.isChecked && this.mode === this.modeConst.EDIT) {
      this.matTransferringShipmentsService.getData(null, '/get-seq').subscribe(res => {
        this.f['transferPickingNo'].setValue('QLVTTH_PDC_' + String(res.data).padStart(6, '0'));
      });
    }
    this.changeCheck(this.isChecked);
  }

  initDataSelect() {
    if (this.mode == this.modeConst.VIEW) {
      this.warehouseService.getList(null).subscribe(res => {
        this.listWarehouse = res.data;
        this.listWarehouseTransfer = res.data;
      });
    } else {
      this.warehouseService.getList({
        isUserLogin: 'Y',
        isGeneralWarehouse: 'Y',
        isActive: 'Y'
      }).subscribe(res => {
        this.listWarehouse = res.data;
      });
      this.warehouseService.getList({ isActive: 'Y' }).subscribe(res => {
        this.listWarehouseTransfer = res.data;
      });
    }
  }

  changeCheck($event: any) {
    this.f.transferWarehouseId.setValidators($event ? [Validators.required] : null);
    this.f.transferWarehouseId.updateValueAndValidity();
    this.f.transferredDate.setValidators($event ? [Validators.required] : null);
    this.f.transferredDate.updateValueAndValidity();
    this.f.transferPickingNo.setValidators($event ? [Validators.required] : null);
    this.f.transferPickingNo.updateValueAndValidity();
    this.f.receiverId.setValidators($event ? [Validators.required] : null);
    this.f.receiverId.updateValueAndValidity();
  }


  selectEquipments(equipments: any) {
    const listItemSelected = JSON.parse(JSON.stringify(equipments.listItemSelected));
    const eqList = this.equipmentList.tableData.filter(el => equipments.listOfSelected.includes(el.equipmentId));
    const eqChange = listItemSelected.filter(el => !eqList.map(e => e.equipmentId).includes(el.equipmentId));
    this.equipmentList.tableData = [...eqList, ...eqChange];
  }

  override beforeSave() {
    super.beforeSave();
    this.checkTotalPrice();
    this.body.listEquipments = this.equipmentList.tableData;
    this.body.docIdsDelete = this.docIdsDelete;
  }

  listEquipmentIdsChange(listEquipmentIds: number[]) {
    this.f['listEquipmentIds'].setValue(listEquipmentIds);
  }

  checkTotalPrice() {
    const totalPrice = this.equipmentList.tableData.reduce((a: number, b: any) => a + b.amount, 0);
    this.invalidFormViewChild = totalPrice > this.f['contractAmount'].value;
  }


  doImportData() {
    this.isImportData = true;
  }
  isImportData = false;
  fileTemplateName = 'templateImport.xlsx';
  importApi = (body) => this.service.createOrImport(body, REQUEST_TYPE.DEFAULT, '/import-equipments');
  downLoadTemplateApi = () => this.service.downloadFile('/import-equipments-template');
  doDownloadFileByNameApi = (url: string) => this.service.downloadFile(url);
  doCloseImport() {
    this.isImportData = false;
  }

  updateList(res: any) {
    console.log(res)
  }
}


