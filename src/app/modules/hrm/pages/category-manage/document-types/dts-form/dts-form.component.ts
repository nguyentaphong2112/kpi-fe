import { Component, Injector, OnInit } from '@angular/core';
import { BaseFormComponent } from '@core/components/base-form.component';
import { FormArray, Validators } from '@angular/forms';
import { CategoryModel } from '@core/models/category-common.interface';
import { Constant } from '@app/modules/hrm/data-access/constant/constant.class';
import { ObjectUtil } from '@core/utils/object.util';
import { DocumentTypeService } from '@app/modules/hrm/data-access/services/category-manage/document-type.service';
import { CommonUtils } from '@shared/services/common-utils.service';
import { REQUEST_TYPE } from '@shared/constant/common';
import { DataService } from '@shared/services/data.service';

@Component({
  selector: 'app-dts-form',
  templateUrl: './dts-form.component.html',
  styleUrls: ['./dts-form.component.scss']
})
export class DtsFormComponent extends BaseFormComponent<any> implements OnInit {
  listTypeDocument: CategoryModel[] = [];
  constant = Constant;

  constructor(injector: Injector,
              private documentTypeService: DocumentTypeService,
              private dataService: DataService) {
    super(injector);
    this.findOneById = (id) => this.documentTypeService.findOneById(id);
    this.createApi = (body: any) => this.documentTypeService.createOrImport(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.DEFAULT);
    this.updateApi = (body: any) => this.documentTypeService.update(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.DEFAULT);
    this.getConfigAttributeApi = () => this.dataService.getAttributeConfig({
      tableName: 'hr_document_types'
    });
    this.isPage = false;
    this.key = 'documentTypeId';
    this.initDataSelect();
  }

  initDataSelect() {
    this.listTypeDocument = ObjectUtil.optionsToList(this.constant.DOCUMENT_TYPE, this.translate);
    this.getConfigAttributes();
  }

  override initForm() {
    this.form = this.fb.group({
      name: [null, [Validators.required, Validators.maxLength(255)]],
      code: [null, [Validators.required, Validators.maxLength(255)]],
      type: [null, [Validators.required]],
      listAttributes: this.fb.array([])
    });
    this.attributesFormArray = this.form?.get('listAttributes') as FormArray;
  }

}
