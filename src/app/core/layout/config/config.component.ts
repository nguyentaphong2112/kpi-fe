import { Component, Injector, OnInit } from '@angular/core';
import { BaseListComponent } from '@core/components/base-list.component';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { HTTP_STATUS_CODE, MICRO_SERVICE } from '@core/constant/system.constants';
import { FileService } from '@shared/component/hbt-upload/file.service';
import { Mode, REQUEST_TYPE } from '@shared/constant/common';
import { UrlConstant } from '@app/modules/admin/data-access/constants/url.constant';
import { DynamicReportService } from '@app/modules/admin/data-access/services/configurations/dynamic-report.service';
import { ConfigPageService } from '@core/services/config-page.service';
import {
  AttributeFormComponent
} from '@app/modules/admin/pages/configurations/attributes/attribute-form/attribute-form.component';
import { ConfigModalComponent } from '@core/layout/config-modal/config-modal.component';

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.scss']
})
export class ConfigComponent extends BaseListComponent<NzSafeAny> implements OnInit {
  url = '/v1/attachment-file/download/{attachmentId}/{checksum}';
  data: any;
  isVisibleEdit = false;
  fileData: NzSafeAny;
  fileListData: NzSafeAny;
  attachmentDeleteIds = [];
  currentUrl: string;

  constructor(injector: Injector,
              private readonly dynamicReportService: DynamicReportService,
              private readonly configPageService: ConfigPageService,
              private fileService: FileService) {
    super(injector);
  }

  ngOnInit(): void {
  }

  override search() {
    this.currentUrl = this.router.url;
    this.configPageService.getList({ url: this.currentUrl }, UrlConstant.CONFIG_PAGE.CONFIG_URL).subscribe(res => {
      if (res.code === HTTP_STATUS_CODE.SUCCESS) {
        if (res.data?.reportConfigs?.length > 0 || res.data?.configObjectAttributes.length > 0 || res.data?.configParameters.length) {
          this.data = res.data;
        }
      }
    });
  }

  downloadFile(file: NzUploadFile) {
    if (file) {
      const url = this.url.replace('{attachmentId}', file.attachmentId).replace('{checksum}', file.checkSum);
      this.fileService.doDownloadAttachFileWithSecurity(url, null, MICRO_SERVICE.ADMIN).pipe().subscribe();
    }
  }

  openModalEdit(fileData: NzSafeAny) {
    this.isVisibleEdit = true;
    this.fileData = fileData;
    this.fileListData = fileData?.attachmentFileList?.map(item => {
      return {
        uid: item.attachmentId,
        name: item.fileName,
        checkSum: item.checkSum,
        status: 'done'
      };
    });
  }

  handleCancelEdit(): void {
    this.isVisibleEdit = false;
  }

  changeFile(listFile: NzUploadFile[], isMultiple?: boolean) {
    this.fileListData = isMultiple ? listFile : listFile[0];
  }

  removeFileChild(ids: number[]) {
    this.attachmentDeleteIds = ids;
  }

  handleOk() {
    this.dynamicReportService.update({
      files: this.fileListData,
      id: this.fileData?.dynamicReportId,
      data: { attachmentDeleteIds: this.attachmentDeleteIds }
    }, REQUEST_TYPE.FORM_DATA_FILE, UrlConstant.DYNAMIC_REPORTS.FILE)
      .subscribe(res => {
        if (res.code === HTTP_STATUS_CODE.SUCCESS) {
          this.toast.success(
            this.translate.instant('common.notification.updateSuccess')
          );
          this.search();
          this.handleCancelEdit();
        }
      });
  }

  openModalParameter(item: NzSafeAny) {
    this.formConfig = {
      title: 'common.button.attribute',
      content: ConfigModalComponent
    };
    this.addWidth = 300;
    this.doOpenForm(Mode.EDIT, item);
  }


  openModalAttribute(item: NzSafeAny) {
    this.addWidth = 0;
    this.formConfig = {
      title: 'admin.configurations.attributes.label.attribute',
      content: AttributeFormComponent
    };
    this.doOpenForm(Mode.EDIT, item);
  }

}
