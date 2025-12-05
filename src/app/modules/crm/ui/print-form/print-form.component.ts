import { Component, Injector, Input, OnInit } from '@angular/core';
import { FormArray, Validators } from '@angular/forms';
import { PaymentsModel } from '../../data-access/models/category-managers/payments.model';
import { BaseFormComponent } from '@core/components/base-form.component';
import { HTTP_STATUS_CODE, MICRO_SERVICE } from '@core/constant/system.constants';
import { CommonUtils } from '@shared/services/common-utils.service';
import { Mode, REQUEST_TYPE } from '@shared/constant/common';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { map } from 'rxjs/operators';
import { distinctUntilChanged, forkJoin } from 'rxjs';
import { CardTemplatesModel } from '@app/modules/admin/data-access/models/card-templates/card-templates.model';
import { PartnersService } from '@app/modules/crm/data-access/services/category-managers/partners.service';
import { EmployeesService } from '@app/modules/crm/data-access/services/hrm-managers/employees.service';
import { PrintCardModel } from '@app/modules/admin/data-access/models/card-templates/print-card.model';
import { PrintsService } from '@app/modules/crm/data-access/services/category-managers/prints.service';
import { RecipientList } from '@app/modules/crm/data-access/models/category-managers/recipientList.model';

@Component({
  selector: 'print-form',
  templateUrl: './print-form.component.html',
  styleUrls: ['./print-form.component.scss']
})
export class PrintFormComponent extends BaseFormComponent<any> implements OnInit {
  serviceName = MICRO_SERVICE.CRM;
  @Input() type: Mode;
  @Input() data: any;
  recipientList: RecipientList | NzSafeAny;
  cardTemplate: CardTemplatesModel | NzSafeAny;
  previewVisible = false;
  previewImage = '';
  transform = 'translate(0, 0)';
  isDragging = false;
  startX = 0;
  startY = 0;
  translateX = 0;
  translateY = 0;
  originalPosition = 'translate(0, 0)';
  rotation = 0;
  scale = 1;
  displayAttachFileList: any[] = [];
  selectedImage: any = null;
  lastFocusedIndex: number | null = null;
  userLogin: any;
  loginName: any;

  listDefaultParameter: any[] = [];
  listParameters: any[] = [];
  isEmptyFileTemplate = false;

  constructor(
    private readonly service: PartnersService,
    private readonly servicePrint: PrintsService,
    private readonly serviceEmployee: EmployeesService,
    injector: Injector
  ) {
    super(injector);
    this.findOneById = (id) => this.service.findOneById(id);
    this.createApi = (body: PaymentsModel) => this.service.createOrImport(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.FORM_DATA);
    this.updateApi = (body: PaymentsModel) => this.service.update(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.DEFAULT);
  }

  override initForm() {
    this.form = this.fb.group({
      listRecipient: [null, [Validators.required]],
      title: [null],
      fileId: [null],
      templateType: [null],
      listParameter: this.fb.array([]),
      mapParams: Array
    });
  }

  get listParameter(): FormArray {
    return this.form.controls.listParameter as FormArray;
  }

  ngOnInit() {
    super.ngOnInit();
    this.getRecipientList();
    this.patchRecipientBasedOnType();
    this.form.get('listRecipient').setValue([this.data.objId]);

    this.form.get('templateType')?.valueChanges.pipe(distinctUntilChanged()).subscribe(templateType => {
      this.cardTemplateByTitle(templateType);
    });

    this.form.get('title')?.valueChanges.pipe(distinctUntilChanged()).subscribe(value => {
      this.loadTemplateData(value);
    });
  }

  patchRecipientBasedOnType() {
    if (this.data.objType === 'KHACH_HANG') {
      this.form.get('listRecipient')?.patchValue([this.data.customerId]);
    } else if (this.data.objType === 'DOI_TAC') {
      this.form.get('listRecipient')?.patchValue([this.data.partnerId]);
    }
  }

  private cardTemplateByTitle(templateType: any) {
    this.resetFormArrays();
    if (templateType) {
      this.servicePrint.getListTitleCardTemplate(templateType).subscribe(res => {
        this.cardTemplate = res.data;
        this.f.title.setValue(this.cardTemplate[0]?.cardTemplateId);
      });
    } else {
      this.cardTemplate = [];
    }
  }

  loadTemplateData(cardTemplateId: number) {
    this.resetFormArrays();
    if (cardTemplateId) {
      this.isEmptyFileTemplate = false;
      this.servicePrint.getDataByCardTemplateId(cardTemplateId).subscribe(response => {
        this.processTemplateData(response.data);
      });
    }
  }

  processTemplateData(templateData: any) {
    this.isEmptyFileTemplate = templateData?.attachFileList?.length === 0;
    templateData?.listParameter?.forEach(param => {
      const group = this.fb.group({
        code: param.code,
        name: param.name,
        defaultValue: param.defaultValue
      });
      this.listParameter.push(group);
    });

    this.listDefaultParameter = templateData?.listDefaultParameter ?? [];
    this.listParameters = templateData?.listParameter ?? [];

    if (templateData?.attachFileList) {
      const attachmentIds = templateData.attachFileList.map(file => file.attachmentId);
      this.displayAttachFileList.push(...templateData.attachFileList);
      this.fetchAttachmentFiles(attachmentIds, this.displayAttachFileList);
      this.selectImage(templateData.attachFileList[0]);
    }
  }

  fetchAttachmentFiles(attachmentIds: number[], attachFileList: any[]) {
    const fileRequests = attachmentIds.map(attachmentId =>
      this.servicePrint.getFileByAttachmentId(attachmentId).pipe(
        map(res => res.code === HTTP_STATUS_CODE.SUCCESS ? {
          attachmentId,
          fileData: `data:image/jpg;base64,${res.data}`
        } : null)
      )
    );

    forkJoin(fileRequests).subscribe(results => {
      results.forEach(result => {
        if (result) {
          const file = attachFileList.find(f => f.attachmentId === result.attachmentId);
          if (file) file.fileData = result.fileData;
        }
      });
      this.displayAttachFileList = attachFileList;
    });
  }

  getRecipientList() {
    if (!this.recipientList) {
      this.service.getListCardObject({ objType: this.data.objType }).subscribe((res: any) => {
        this.recipientList = res.data;
      });
    }
  }


  onSubmit() {
    this.isSubmitted = true;
    if (this.form.valid) {
      const parameterValues = this.listParameter.controls.map(param => param.get('defaultValue')?.value);
      this.listParameters.forEach((param, index) => {
        param.value = parameterValues[index]; // Cập nhật giá trị value
      });
      const printCardData: PrintCardModel = {
        objType: this.data.objType,
        type: this.f.templateType.value,
        listId: this.f.listRecipient.value,
        fileId: this.selectedImage.fileId || null,
        listParameter: parameterValues,
        mapParams: this.listParameters
      };
      this.service.exportCard(printCardData).toPromise();
    }

  }


  get isFormIncomplete(): boolean {
    const { objType } = this.data;
    const templateType = this.f.templateType?.value || null;
    let listRecipient = this.f.listRecipient?.value || [];
    const fileId = this.selectedImage?.fileId || null;
    const listParameter = this.listParameter.controls.map(param => param.get('defaultValue')?.value);

    listRecipient = listRecipient.filter(item => item !== undefined);
    const isListRecipientValid = Array.isArray(listRecipient) && listRecipient.length > 0;

    return !objType || !templateType || !isListRecipientValid || !fileId || listParameter.some(param => !param);
  }

  onFocus(index: number) {
    this.lastFocusedIndex = index;
  }

  addTextAtCursor(textToAdd: string) {
    if (this.lastFocusedIndex !== null) {
      this.addTextToInput(this.lastFocusedIndex, textToAdd);
    }
  }

  addTextToInput(index: number, textToAdd: string) {
    const control = this.form.get(`listParameter.${index}.defaultValue`);
    if (control) {
      const inputElements = document.querySelectorAll(`hbt-input-text textarea`) as NodeListOf<HTMLTextAreaElement>;
      const inputElement = inputElements[index];

      if (inputElement) {
        inputElement.focus();
        const start = inputElement.selectionStart || 0;
        const end = inputElement.selectionEnd || 0;
        const currentValue = control.value || '';
        const updatedValue = currentValue.slice(0, start) + textToAdd + currentValue.slice(end);
        control.setValue(updatedValue);

        setTimeout(() => {
          const cursorPosition = start + textToAdd.length;
          inputElement.setSelectionRange(cursorPosition, cursorPosition);
          inputElement.focus();
        }, 0);
      }
    }
  }

  // Hàm xử lý khi giữ chuột
  onMouseDown(event: MouseEvent) {
    event.preventDefault();
    this.isDragging = true;
    this.startX = event.clientX;
    this.startY = event.clientY;
  }

  // Hàm xử lý khi di chuyển chuột
  onMouseMove(event: MouseEvent) {
    if (this.isDragging) {
      const dx = event.clientX - this.startX;
      const dy = event.clientY - this.startY;
      this.translateX += dx;
      this.translateY += dy;
      this.transform = `translate(${this.translateX}px, ${this.translateY}px)`;
      this.startX = event.clientX;
      this.startY = event.clientY;
    }
  }

  // Hàm xử lý khi thả chuột
  onMouseUp() {

    this.isDragging = false;
    // Đặt lại vị trí hình ảnh về vị trí ban đầu
    this.translateX = 0;
    this.translateY = 0;
    this.transform = this.originalPosition; // Trở về vị trí ban đầu
  }


  openPreview(image: string) {
    this.previewImage = image;
    this.previewVisible = true;
    this.rotation = 0;
    this.scale = 1;
    this.updateTransform();
  }

  closePreview() {
    this.previewVisible = false;
    this.previewImage = '';
  }

  rotateImage(direction: 'left' | 'right') {
    this.rotation += direction === 'left' ? -90 : 90;
    this.updateTransform();
  }

  zoomImage(action: 'in' | 'out') {
    const zoomFactor = 0.1;
    if (action === 'in') {
      this.scale += zoomFactor;
    } else if (action === 'out' && this.scale > zoomFactor) {
      this.scale -= zoomFactor;
    }
    this.updateTransform();
  }

  updateTransform() {
    this.transform = `rotate(${this.rotation}deg) scale(${this.scale})`;
  }

  selectImage(file: any): void {
    this.selectedImage = this.selectedImage === file ? null : file;
  }


  removeImage(attachmentId: number) {
    this.popupService.showModalConfirmDelete(() => {
      this.servicePrint.deleteById(attachmentId?.toString(), '/delete-file').subscribe(res => {
        if (res.code === HTTP_STATUS_CODE.SUCCESS) {
          const index = this.displayAttachFileList.findIndex((file: any) => file.attachmentId === attachmentId);
          if (index !== -1) {
            this.displayAttachFileList.splice(index, 1);
          }
          this.toast.success(this.translate.instant('common.notification.deleteSuccess'));
        }
      });
    });
  }

  resetFormArrays() {
    this.listParameter.clear();
    this.listDefaultParameter = [];
    this.displayAttachFileList = [];
  }
}


