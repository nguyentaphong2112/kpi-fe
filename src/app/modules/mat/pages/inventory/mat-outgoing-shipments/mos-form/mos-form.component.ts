import {Component, Injector, OnInit, ViewChild} from '@angular/core';
import {Validators} from '@angular/forms';
import {MatOutgoingShipmentsModel} from '../../../../data-access/models/inventory/mat-outgoing-shipments.model';
import {MatOutgoingShipmentsService} from '../../../../data-access/services/inventory/mat-outgoing-shipments.service';
import {BaseFormComponent} from '@core/components/base-form.component';
import {MICRO_SERVICE} from '@core/constant/system.constants';
import {CommonUtils} from '@shared/services/common-utils.service';
import {REQUEST_TYPE} from '@shared/constant/common';
import {
  EquipmentListComponent
} from '@app/modules/mat/pages/inventory/mat-outgoing-shipments/mos-form/equipment-list/equipment-list.component';

@Component({
  selector: 'mos-form',
  templateUrl: './mos-form.component.html',
  styleUrls: ['./mos-form.component.scss']
})
export class MosFormComponent extends BaseFormComponent<MatOutgoingShipmentsModel> implements OnInit {

  @ViewChild(EquipmentListComponent) equipmentList: EquipmentListComponent;

  serviceName = MICRO_SERVICE.MAT;
  urlLoadData = '/equipments/search/list';
  constructor(
    private readonly service: MatOutgoingShipmentsService,
    injector: Injector
  ) {
    super(injector);
    this.key = 'outgoingShipmentId';
    this.findOneById = (id) => this.service.findOneById(id);
    this.createApi = (body: MatOutgoingShipmentsModel) => this.service.createOrImport(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.FORM_DATA);
    this.updateApi = (body: MatOutgoingShipmentsModel) => this.service.update(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.FORM_DATA);
  }

  override initForm() {
    this.form = this.fb.group({

      isSendToApprove: ['N'],
      outgoingShipmentId: [null],
      warehouseId: [null, [Validators.required]],
      outgoingDate: [null, [Validators.required]],
      pickingNo: [null, [Validators.required]],
      pickingEmployeeId: [null, [Validators.required]],
      receiverId: [null],
      note: [null],
      approvedName: [null],
      approvedNote: [null],
      incomingWarehouseId: [null],
      incomingTransferPickingNo: [null],
      type: [null],
      approvedTime: [null],
      statusId: [null],
      hasApproveExport: [null],
      files: [null],
      docIdsDelete: [[]],
      listEquipments: [],
      listEquipmentIds: [null, [Validators.required]],
    });
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
  downLoadTemplateApi = () => this.service.downloadFile('/import-equipments-template', {warehouseId: this.form.controls['warehouseId'].value});
  doDownloadFileByNameApi = (url: string) => this.service.downloadFile(url);
  doCloseImport() {
    this.isImportData = false;
  }

  updateList(res: any) {
    console.log(res)
  }
}


