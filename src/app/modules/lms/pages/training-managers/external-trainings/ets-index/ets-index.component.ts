import { Component, Injector, OnInit } from '@angular/core';
import { ExternalTrainingsModel } from '../../../../data-access/models/training-managers/external-trainings.model';
import {
  ExternalTrainingsService
} from '../../../../data-access/services/training-managers/external-trainings.service';
import { BaseListComponent } from '@core/components/base-list.component';
import { CommonUtils } from '@shared/services/common-utils.service';
import { ActionSchema, ChildActionSchema } from '@core/models/action.model';
import { Constant } from '@app/modules/lms/data-access/constants/constants';
import {
  EtsFormComponent
} from '@app/modules/lms/pages/training-managers/external-trainings/ets-form/ets-form.component';
import { REQUEST_TYPE } from '@shared/constant/common';

@Component({
  selector: 'app-ets-index',
  templateUrl: './ets-index.component.html',
  styleUrls: ['./ets-index.component.scss']
})


export class EtsIndexComponent extends BaseListComponent<ExternalTrainingsModel> implements OnInit {
  isShowAdvSearch = false;
  functionCode = Constant.FUNCTION_CODE.EXTERNAL_TRAINING;

  constructor(
    injector: Injector,
    private readonly service: ExternalTrainingsService
  ) {
    super(injector);
    this.initFormSearch();
    this.deleteApi = (id: number | string) => this.service.deleteById(id.toString());
    this.searchApi = (body, pagination) => this.service.getFilterResearch(CommonUtils.convertDataSendToServer(body, true), pagination);
    this.exportApi = (body) => this.service.export(body);
    this.downLoadTemplateApi = () => this.service.downloadFile('/download-template');
    this.importApi = (body) => this.service.createOrImport(body, REQUEST_TYPE.DEFAULT, '/import');
    this.doDownloadFileByNameApi = (url: string, fileName: string) => this.service.downloadFileByName(url, {fileName: fileName});
    this.key = 'externalTrainingId';
    this.formConfig = {
      title: 'lms.externalTrainings.pageName',
      content: EtsFormComponent
    };
  }

  ngOnInit() {
    super.ngOnInit();
    this.initAction();
  }

  initFormSearch() {
    this.form = this.fb.group({
      keySearch: null,
      typeId: null,
      startDate: null,
      endDate: null
    });
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

  override setHeaders() {
    this.tableConfig.headers = [
      {
        title: 'STT',
        thClassList: ['text-center'],
        tdClassList: ['text-center'],
        fixed: true,
        fixedDir: 'left',
        width: 70
      },
      {
        title: 'lms.externalTrainings.table.typeId',
        field: 'typeName',
        width: 100
      },
      {
        title: 'lms.externalTrainings.table.fullName',
        field: 'fullName',
        width: 200
      },
      {
        title: 'lms.externalTrainings.table.genderId',
        field: 'genderName',
        thClassList: ['text-center'],
        tdClassList: ['text-center'],
        width: 70
      },
      {
        title: 'lms.externalTrainings.table.yearOfBirth',
        field: 'yearOfBirth',
        thClassList: ['text-center'],
        tdClassList: ['text-center'],
        width: 50
      },
      {
        title: 'lms.externalTrainings.table.mobileNumber',
        field: 'mobileNumber',
        thClassList: ['text-center'],
        tdClassList: ['text-center'],
        width: 110
      },
      {
        title: 'lms.externalTrainings.table.personalIdNo',
        field: 'personalIdNo',
        thClassList: ['text-center'],
        tdClassList: ['text-center'],
        width: 110
      },
      {
        title: 'lms.externalTrainings.table.address',
        field: 'address',
        width: 200
      },
      {
        title: 'lms.externalTrainings.table.organizationAddress',
        field: 'organizationAddress',
        width: 200
      },
      {
        title: 'lms.externalTrainings.table.startDate',
        field: 'startDate',
        thClassList: ['text-center'],
        tdClassList: ['text-center'],
        width: 100
      },
      {
        title: 'lms.externalTrainings.table.endDate',
        field: 'endDate',
        thClassList: ['text-center'],
        tdClassList: ['text-center'],
        width: 100
      },
      {
        title: 'lms.externalTrainings.table.trainningTypeId',
        field: 'trainningTypeName',
        width: 200
      },
      {
        title: 'lms.externalTrainings.table.trainingMajorId',
        field: 'trainingMajorName',
        width: 200
      },
      {
        title: 'lms.externalTrainings.table.content',
        field: 'content',
        width: 200
      },
      {
        title: 'lms.externalTrainings.table.organizationId',
        field: 'organizationName',
        width: 200
      },
      {
        title: 'lms.externalTrainings.table.mentorId',
        field: 'mentorName',
        width: 200
      },
      {
        title: 'lms.externalTrainings.table.admissionResults',
        field: 'admissionResults',
        width: 200
      },
      {
        title: 'lms.externalTrainings.table.graduatedResults',
        field: 'graduatedResults',
        width: 200
      },
      {
        title: 'lms.externalTrainings.table.certificateNo',
        field: 'certificateNo',
        width: 200
      },
      {
        title: 'lms.externalTrainings.table.certificateDate',
        field: 'certificateDate',
        thClassList: ['text-center'],
        tdClassList: ['text-center'],
        width: 100
      },
      {
        title: 'lms.externalTrainings.table.tuitionFeeStatusId',
        field: 'tuitionFeeStatusName',
        width: 200
      },
      {
        title: 'lms.externalTrainings.table.numberOfLessons',
        field: 'numberOfLessons',
        width: 200
      },
      {
        title: 'lms.externalTrainings.table.createdBy',
        field: 'createdBy',
        width: 120,
        show: false
      },
      {
        title: 'lms.externalTrainings.table.createdTime',
        field: 'createdTime',
        width: 120,
        show: false,
        tdClassList: ['text-center'],
        thClassList: ['text-center']
      },
      {
        title: 'lms.externalTrainings.table.modifiedBy',
        field: 'modifiedBy',
        width: 120,
        show: false
      },
      {
        title: 'lms.externalTrainings.table.modifiedTime',
        field: 'modifiedTime',
        width: 120,
        show: false,
        tdClassList: ['text-center'],
        thClassList: ['text-center']
      },
      {
        title: 'lms.externalTrainings.table.lastUpdateTime',
        field: 'lastUpdateTime',
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
        show: this.objFunction?.approve || this.objFunction?.delete || this.objFunction?.edit
      }
    ];
  }
}

