import { Component, Injector, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { QuestionsModel } from '../../../../data-access/models/question-manager/questions.model';
import { QuestionsService } from '../../../../data-access/services/question-manager/questions.service';
import { BaseListComponent } from '@core/components/base-list.component';
import { MICRO_SERVICE } from '@core/constant/system.constants';
import { CommonUtils } from '@shared/services/common-utils.service';
import { REQUEST_TYPE, STATUS } from '@shared/constant/common';
import { UrlConstant as UrlConstantShare } from '@shared/constant/url.class';
import { TranslateService } from '@ngx-translate/core';
import { FormUtils } from '@shared/utils/form-utils.class';

@Component({
  selector: 'app-questions-index',
  templateUrl: './questions-index.component.html',
  styleUrls: ['./questions-index.component.scss']
})


export class QuestionsIndexComponent extends BaseListComponent<QuestionsModel> implements OnInit {
  serviceName = MICRO_SERVICE.EXAM;
  urlLoadData = '/questions';
  urlConstantShare = UrlConstantShare;
  microService = MICRO_SERVICE;
  isShowAdvSearch = false;
  @ViewChild('attachFileTmpl', { static: true }) attachFile!: TemplateRef<any>;

  constructor(
    injector: Injector,
    private readonly service: QuestionsService
  ) {
    super(injector);
    this.initFormSearch();
    this.deleteApi = (id: number | string) => this.service.deleteById(id.toString());
    this.searchApi = (body, pagination) => this.service.getFilterResearch(CommonUtils.convertDataSendToServer(body, true), pagination);
    this.exportApi = (body) => this.service.export(CommonUtils.convertDataSendToServer(body, true));
    this.importApi = (body) => this.service.createOrImport(body, REQUEST_TYPE.FORM_DATA, '/import');
    this.downLoadTemplateApi = () => this.service.downloadFile('/download-template');
    this.doDownloadFileByNameApi = (url: string) => this.service.downloadFile(url);
    this.approveByListApi = (listId: number[], afterUrl?: string) => this.service.approveByList(listId);
    this.rejectByListApi = (listId: number[], rejectReason: string, afterUrl?: string) => this.service.rejectByList(listId, rejectReason);
    this.approveAllApi = (data: any, afterUrl?: string) => this.service.approveAll(CommonUtils.convertDataSendToServer(data));
    this.serviceName = MICRO_SERVICE.EXAM;
    this.urlApiDownloadTemp = '';
    this.urlApiImport = '';
    this.key = 'resourceId';
  }

  initFormSearch() {
    this.form = this.fb.group({
      code: [null],
      flagStatus: [1],
      flagStatus1: []
    });
    this.tableData = [
      {
        questionId: 1,
        code: 'MATH_001',
        subjectName: 'Toán học',
        content: '2 + 2 = ?',
        levelCode: 'Dễ',
        typeCode: 'Tự luận',
        point: 1
      },
      {
        questionId: 2,
        code: 'PHY_002',
        subjectName: 'Vật lý',
        content: 'Công thức tính vận tốc là gì?',
        levelCode: 'Bình thường',
        typeCode: 'Trắc nghiệm',
        point: 1
      },
      {
        questionId: 3,
        code: 'CHEM_003',
        subjectName: 'Hóa học',
        content: 'Nguyên tử Oxy có bao nhiêu electron?',
        levelCode: 'Khó',
        typeCode: 'Trắc nghiệm',
        point: 0.5
      }
    ];
    const form = this.form.value;
    const payload = {
      ...form,
      page: 0,
      size: 100,
    };
    this.service.searchData(payload).subscribe(res => {
        if (res.status == STATUS.ACTIVE) {
          this.tableData = res.result;
        }
      }
    );
  }

  override beforeSearch() {
  }

  override beforeRenderTable() {
    this.responseSearch.data.listData.forEach(el => {
      // el.list = this.list;
    });
  }

  override beforeExport() {
  }

  override setHeaders() {
    this.tableConfig.key = this.key;
    this.tableConfig.showSelect = true;
    this.tableConfig.headers = [
      {
        title: 'STT',
        thClassList: ['text-center'],
        tdClassList: ['text-center'],
        fixed: true,
        fixedDir: 'left',
        width: 50
      },
      {
        title: this.translate.instant('exam.questions.table.questionId'),
        field: 'questionId',
        width: 100,
        tdClassList: ['text-center'],
        thClassList: ['text-center']
      },
      {
        title: 'exam.questions.table.code',
        field: 'code',
        width: 120
      },
      {
        title: 'exam.questions.table.subjectName',
        field: 'subjectName',
        width: 120
      },
      {
        title: 'exam.questions.table.content',
        field: 'content',
        width: 220
      },
      {
        title: 'exam.questions.table.levelCode',
        field: 'levelCode',
        width: 100
      },
      {
        title: 'exam.questions.table.typeCode',
        field: 'typeCode',
        width: 100
      },
      {
        title: 'exam.questions.table.point',
        field: 'point',
        width: 100
      },
      {
        title: ' ',
        field: 'action',
        tdClassList: ['text-nowrap', 'text-center'], thClassList: ['text-nowrap', 'text-center'],
        width: 50,
        fieldType: 'tdTemplate',
        fieldTypeValue: this.actionTpl,
        fixed: window.innerWidth > 1024,
        fixedDir: 'right',
        show: this.objFunction?.approve || this.objFunction?.delete || this.objFunction?.edit
      }
    ];
  };
}

