import { Component, Injector, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MentoringTrainersModel } from '../../../../data-access/models/mentorings/mentoring-trainers.model';
import { MentoringTrainersService } from '../../../../data-access/services/mentorings/mentoring-trainers.service';
import { BaseListComponent } from '@core/components/base-list.component';
import { MICRO_SERVICE } from '@core/constant/system.constants';
import { CommonUtils } from '@shared/services/common-utils.service';
import { REQUEST_TYPE } from '@shared/constant/common';
import { UrlConstant as UrlConstantShare } from '@shared/constant/url.class';
import { MtsFormComponent } from '@app/modules/lms/pages/mentorings/mentoring-trainers/mts-form/mts-form.component';
import { Scopes } from '@core/utils/common-constants';
import { ActionSchema, ChildActionSchema } from '@core/models/action.model';
import { Constant } from '@app/modules/lms/data-access/constants/constants';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

@Component({
  selector: 'app-mts-index',
  templateUrl: './mts-index.component.html',
  styleUrls: ['./mts-index.component.scss']
})


export class MtsIndexComponent extends BaseListComponent<MentoringTrainersModel> implements OnInit {
  serviceName = MICRO_SERVICE.LMS;
  urlLoadData = '/mentoring-trainers';
  urlConstantShare = UrlConstantShare;
  isShowAdvSearch = false;
  microService = MICRO_SERVICE
  functionCode = Constant.FUNCTION_CODE.MENTORING_TRAINERS;
  validators: ValidatorFn[] = [];

  @Input() scope: string = Scopes.VIEW;

  @ViewChild('attachFileTmpl', { static: true }) attachFile!: TemplateRef<any>;

  constructor(
    injector: Injector,
    private readonly service: MentoringTrainersService
  ) {
    super(injector);
    this.initFormSearch();
    this.initAction();
    this.deleteApi = (id: number | string) => this.service.deleteById(id.toString());
    this.searchApi = (body, pagination) => this.service.getFilterResearch(CommonUtils.convertDataSendToServer(body, true), pagination);
    this.exportApi = (body) => this.service.export(CommonUtils.convertDataSendToServer(body, true));
    this.importApi = (body) => this.service.createOrImport(body, REQUEST_TYPE.DEFAULT, '/import-process');
    this.downLoadTemplateApi = () => this.service.downloadFile('/download-template');
    this.doDownloadFileByNameApi = (url: string, fileName: string) => this.service.downloadFileByName(url, {fileName: fileName});
    this.serviceName = MICRO_SERVICE.LMS;
    this.setValidators();
    this.key = 'mentoringTrainerId';
    this.formConfig = {
      title: 'med.mentoringTrainers.pageName',
      content: MtsFormComponent
    }
  }

  public setValidators() {
    this.form.setValidators(this.validateTwoDate('startDate', 'endDate', 'rangeDateError'));
  }

  validateTwoDate(startDateKey: string, endDateKey: string, errorKey: string): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const startDate = formGroup.get(startDateKey)?.value;
      const endDate = formGroup.get(endDateKey)?.value;

      if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
        const errors = { [errorKey]: true };
        formGroup.get(endDateKey)?.setErrors(errors);
        return errors;
      } else {
        formGroup.get(endDateKey)?.setErrors(null);
      }
      return null;
    };
  }

  initFormSearch() {
    this.form = this.fb.group({
      keySearch: [null],
      orgId :[null],
      startDate: [null],
      endDate: [null]
    });
  }



  ngOnInit() {
    super.ngOnInit();
    this.objFunction = this.sessionService.getSessionData(`FUNCTION_${this.functionCode}`);
    this.initAction();
  }

  initAction() {
    this.actionSchema = new ActionSchema({
      arrAction: [
        new ChildActionSchema({
          label: 'common.button.edit',
          icon: 'edit',
          isShow: this.objFunction?.edit,
          function: this.doOpenFormEdit
        }),
        new ChildActionSchema({
          label: 'common.button.delete',
          icon: 'delete',
          isShow: this.objFunction?.delete,
          function: this.deleteItem
        })
      ]
    });
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
          title: 'med.mentoringTrainers.table.employeeCode',
          field: 'employeeCode',
          width: 120,
          tdClassList: ['text-center'],
          thClassList: ['text-center']
        },
        {
          title: 'med.mentoringTrainers.table.employeeName',
          field: 'fullName',
          width: 120,
          tdClassList: ['text-center'],
          thClassList: ['text-center']
        },
      {
          title: 'med.mentoringTrainers.table.orgName',
          field: 'orgName',
          width: 200,
          tdClassList: ['text-center'],
          thClassList: ['text-center']
        },
        {
          title: 'med.mentoringTrainers.table.roleName',
          field: 'roleName',
          width: 120,
        },
        {
          title: 'med.mentoringTrainers.table.startDate',
          field: 'startDate',
          width: 120,
          tdClassList: ['text-center'],
          thClassList: ['text-center']
        },
        {
          title: 'med.mentoringTrainers.table.endDate',
          field: 'endDate',
          width: 120,
          tdClassList: ['text-center'],
          thClassList: ['text-center']
        },
        {
          title: 'med.mentoringTrainers.table.majorName',
          field: 'majorName',
          width: 120,
        },
        {
          title: 'med.mentoringTrainers.table.hospitalName',
          field: 'hospitalName',
          width: 120,
        },
        {
          title: 'med.mentoringTrainers.table.content',
          field: 'content',
          width: 120,
        },
        {
          title: 'med.mentoringTrainers.table.className',
          field: 'className',
          width: 120,
        },
        {
          title: 'med.mentoringTrainers.table.totalLessons',
          field: 'totalLessons',
          width: 120,
          tdClassList: ['text-center'],
          thClassList: ['text-center']
        },
        {
          title: 'med.mentoringTrainers.table.totalClasses',
          field: 'totalClasses',
          width: 120,
          tdClassList: ['text-center'],
          thClassList: ['text-center']
        },
        {
          title: 'med.mentoringTrainers.table.totalStudents',
          field: 'totalStudents',
          width: 120,
          tdClassList: ['text-center'],
          thClassList: ['text-center']
        },
        {
          title: 'med.mentoringTrainers.table.totalExaminations',
          field: 'totalExaminations',
          width: 120,
          tdClassList: ['text-center'],
          thClassList: ['text-center']
        },
        {
          title: 'med.mentoringTrainers.table.totalSurgeries',
          field: 'totalSurgeries',
          width: 120,
          tdClassList: ['text-center'],
          thClassList: ['text-center']
        },
        {
          title: 'med.mentoringTrainers.table.totalTests',
          field: 'totalTests',
          width: 120,
          tdClassList: ['text-center'],
          thClassList: ['text-center']
        },
        {
          title: 'med.mentoringTrainers.table.createdBy',
          field: 'createdBy',
          width: 120,
          show: false,
        },
        {
          title: 'med.mentoringTrainers.table.createdTime',
          field: 'createdTime',
          width: 120,
          show: false,
          tdClassList: ['text-center'],
          thClassList: ['text-center']
        },
        {
          title: 'med.mentoringTrainers.table.modifiedBy',
          field: 'modifiedBy',
          width: 120,
          show: false,
        },
        {
          title: 'med.mentoringTrainers.table.modifiedTime',
          field: 'modifiedTime',
          width: 120,
          show: false,
          tdClassList: ['text-center'],
          thClassList: ['text-center']
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
          show: this.objFunction?.approve || this.objFunction?.delete || this.objFunction?.edit,
        }
      ]
    };
  }

