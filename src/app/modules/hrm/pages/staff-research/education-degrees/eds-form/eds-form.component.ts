import { Component, Injector, OnInit } from '@angular/core';
import { FormArray, Validators } from '@angular/forms';
import { BaseFormComponent } from '@app/core/components/base-form.component';
import { UrlConstant } from '@app/modules/hrm/data-access/constant/url.class';
import { Constant, Mode, REQUEST_TYPE } from '@app/shared/constant/common';
import { CommonUtils } from '@app/shared/services/common-utils.service';
import { DataService } from '@app/shared/services/data.service';
import { EducationDegreesService } from '@app/modules/hrm/data-access/services/staff-research/education-degrees.service';
import { EducationDegreesModel } from '@app/modules/hrm/data-access/models/research/education-degrees.model';
import { Utils } from '@core/utils/utils';
import { FunctionCode } from '@app/shared/enums/enums-constant';
import { Scopes } from '@app/core/utils/common-constants';
import { CategoriesService } from '@app/modules/admin/data-access/services/categories/categories.service';
import { CategoryModel } from '@core/models/category-common.interface';

@Component({
  selector: 'app-eds-form',
  templateUrl: './eds-form.component.html',
  styleUrls: ['./eds-form.component.scss']
})
export class EdsFormComponent extends BaseFormComponent<EducationDegreesModel> implements OnInit {
  configShowForm = { trainingSchoolName: false, majorName: false, majorLevelName: false, graduatedRankName: false };
  listTrainingSchool: CategoryModel[] = [];
  listMajor: CategoryModel[] = [];
  listGraduatedRank: CategoryModel[] = [];
  urlConstant = UrlConstant;
  hiddenEmp = false;
  data: any;
  employeeId: number;
  functionCode = FunctionCode.HR_EDUCATION_DEGREES;
  scope = Scopes.CREATE;
  showTrainingSchoolName = false;
  showMajorName = false;
  showGraduatedRankName = false;
  suggestListTrainingSchool: any;
  suggestListMajorName : any;

  constructor(
    private readonly service: EducationDegreesService,
    private categoryService: CategoriesService,
    private dataService: DataService,
    injector: Injector
  ) {
    super(injector);
    this.key = 'educationDegreeId';
    this.initForm();
    this.initDataSelect();
    this.findOneById = (id) => this.service.findOneById(id, this.config ?? `/${this.data.employeeId}`);
    this.createApi = (body: EducationDegreesModel) => this.service.createOrImport(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.FORM_DATA_FILE, this.config ?? `/${this.f.employeeId.value}`);
    this.updateApi = (body: EducationDegreesModel) => this.service.update(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.FORM_DATA_FILE, this.config ?? `/${this.f.employeeId.value}`);
    this.getConfigAttributeApi = () => this.dataService.getAttributeConfig({ tableName: 'hr_education_degrees' });
    this.getConfigAttributes();
  }

  ngOnInit() {
    super.ngOnInit();
    this.employeeId = this.data?.employeeId;
    if (this.employeeId && this.mode === Mode.ADD) {
      this.form.controls.employeeId.setValue(this.employeeId);
    }
    this.hiddenEmp = this.data.hiddenEmp;
    this.getListData();
  }

  initDataSelect() {
    this.categoryService.getList(null, UrlConstant.CATEGORY.GET_CATEGORIES.replace('{typeCode}', this.categoryCode.TRUONG_DAO_TAO))
      .subscribe(res => {
        this.listTrainingSchool = res.data;
        if (this.listTrainingSchool?.length == 0) {
          this.showTrainingSchoolName = true;
          this.f.trainingSchoolName.addValidators([Validators.required]);
          this.f.trainingSchoolId.clearValidators();
          this.f.trainingSchoolName.updateValueAndValidity();
          this.f.trainingSchoolId.updateValueAndValidity();
        }
      });
    this.categoryService.getList(null, UrlConstant.CATEGORY.GET_CATEGORIES.replace('{typeCode}', this.categoryCode.CHUYEN_NGANH_DAO_TAO))
      .subscribe(res => {
        this.listMajor = res.data;
        if (this.listMajor?.length == 0) {
          this.showMajorName = true;
          this.f.majorName.addValidators([Validators.required]);
          this.f.majorId.clearValidators();
          this.f.majorName.updateValueAndValidity();
          this.f.majorId.updateValueAndValidity();
        }
      });

    this.categoryService.getList(null, UrlConstant.CATEGORY.GET_CATEGORIES.replace('{typeCode}', this.categoryCode.XEP_LOAI_TN), true)
      .subscribe(res => {
        this.listGraduatedRank = res.data;
        if (this.listGraduatedRank?.length == 0) {
          this.showGraduatedRankName = true;
          this.f.graduatedRankName?.addValidators([Validators.required]);
          this.f.graduatedRankId?.clearValidators();
          this.f.graduatedRankName?.updateValueAndValidity();
          this.f.graduatedRankId?.updateValueAndValidity();
        }
      });
  }

  getListData(): void {
    this.service.suggestDataListByType('training_school_name').subscribe(res => {
      this.suggestListTrainingSchool = res.data.map(item => item.trainingSchoolName);
    });
    this.service.suggestDataListByType('major_name').subscribe(res => {
      this.suggestListMajorName = res.data.map(item => item.majorName);
    });
  }

  initForm() {
    this.form = this.fb.group({
      educationDegreeId: [null],
      employeeId: [null, [Validators.required]],
      majorId: [null, [Validators.required, Validators.maxLength(50)]],
      majorName: [null, [Validators.maxLength(255)]],
      majorLevelId: [null, [Validators.required, Validators.maxLength(50)]],
      majorLevelName: [null, [Validators.maxLength(255)]],
      trainingMethodId: [null, [Validators.required, Validators.maxLength(50)]],
      trainingSchoolId: [null, [Validators.required, Validators.maxLength(50)]],
      trainingSchoolName: [null, [Validators.maxLength(255)]],
      isHighest: [null],
      graduatedYear: [null, [Validators.required]],
      graduatedRankId: [null, [Validators.maxLength(50)]],
      graduatedRankName: [null, [Validators.maxLength(255)]],
      files: [null, [Validators.required]],
      listAttributes: this.fb.array([])
    });

    this.attributesFormArray = this.form?.get('listAttributes') as FormArray;
  }

  patchValueInfo() {
    this.form.patchValue(this.data);
    if (this.data?.isHighest?.toUpperCase() === 'N') {
      this.f.isHighest.setValue(false);
    }
    this.f?.graduatedYear?.setValue(Utils.convertDateToFillForm(this.data?.graduatedYear, 'yyyy'));
    const files = this.data.attachFileList?.map(item => {
      return {
        uid: item.attachmentId,
        name: item.fileName,
        checkSum: item.checkSum,
        status: 'done'
      };
    });
    this.f.files.setValue(files);
  }

  changeEduInfo(event: string, controlName: string) {
    if (event === Constant.OTHER_VALUE) {
      this.f[controlName]?.addValidators([Validators.required]);
      this.configShowForm[controlName] = true;
    } else {
      this.f[controlName]?.setValidators(null);
      this.f[controlName]?.reset(null);
      this.configShowForm[controlName] = false;
    }
    this.f[controlName]?.updateValueAndValidity();
  }

  beforeSave() {
    const data = this.form.value;
    delete data?.files;
    this.body = {
      id: this.body.educationDegreeId,
      data: {
        ...data,
        attachmentDeleteIds: this.docIdsDelete,
        isHighest: this.f.isHighest.value ? 'Y' : 'N',
        graduatedYear: Utils.convertDateToSendServer(this.f.graduatedYear.value, 'yyyy')
      },
      files: this.f.files.value?.filter(item => item instanceof File)
    };
  }

}
