import { Component, Injector, OnInit } from '@angular/core';
import { BaseFormComponent } from '@core/components/base-form.component';
import { UrlConstant } from '@app/modules/hrm/data-access/constant/url.class';
import { DataService } from '@shared/services/data.service';
import { CommonUtils } from '@shared/services/common-utils.service';
import { Constant, Mode, REQUEST_TYPE } from '@shared/constant/common';
import { FormArray, Validators } from '@angular/forms';
import { EducationCertificatesModel } from '@app/modules/hrm/data-access/models/research/education-certificates.model';
import {
  EducationCertificatesService
} from '@app/modules/hrm/data-access/services/staff-research/education-certificates.service';
import { distinctUntilChanged } from 'rxjs';
import { HTTP_STATUS_CODE } from '@core/constant/system.constants';
import { CatalogModel } from '@shared/model/catalog-model';
import { DateValidator } from '@shared/custom-validator/dateValidator.class';
import { FunctionCode } from '@app/shared/enums/enums-constant';
import { Scopes } from '@app/core/utils/common-constants';
import { CategoriesService } from '@shared/services/categories.service';
import { StringUtils } from '@shared/utils/string-utils.class';
import { SelectModal } from '@shared/component/hbt-select/select.component';

@Component({
  selector: 'app-ece-form',
  templateUrl: './ece-form.component.html',
  styleUrls: ['./ece-form.component.scss']
})
export class EceFormComponent extends BaseFormComponent<EducationCertificatesModel> implements OnInit {
  configShowForm = { certificateName: false, certificateId: true, certificateResult: false };
  urlConstant = UrlConstant;
  listCertificates: CatalogModel[] = [];
  listCertificateResult: any[] = [];
  listCertificatesType: any[] = [];
  listCertificatesTypeGroup: any[] = [];
  hiddenEmp = false;
  data: any;
  employeeId: number;
  functionCode = FunctionCode.HR_EDUCATION_CERTIFICATES;
  functionCodeCertificateType = null;
  scope = Scopes.CREATE;
  isInputTextResult = false;
  labelCertificate = this.translate.instant('hrm.staffManager.educationCertificates.table.certificateName');
  isLoadData = true;

  constructor(
    private readonly service: EducationCertificatesService,
    private dataService: DataService,
    private categoryService: CategoriesService,
    injector: Injector
  ) {
    super(injector);
    this.key = 'educationCertificateId';
    this.initDataSelected();
    this.findOneById = (id) => this.service.findOneById(id, this.config ?? `/${this.data.employeeId}`);
    this.createApi = (body: EducationCertificatesModel) => this.service.createOrImport(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.FORM_DATA_FILE, this.config ?? `/${this.f.employeeId.value}`);
    this.updateApi = (body: EducationCertificatesModel) => this.service.update(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.FORM_DATA_FILE, this.config ?? `/${this.f.employeeId.value}`);
    this.getConfigAttributeApi = () => this.dataService.getAttributeConfig({
      tableName: 'hr_education_certificates',
      functionCode: this.functionCodeCertificateType
    });
  }

  ngOnInit() {
    super.ngOnInit();
    this.employeeId = this.data?.employeeId;
    if (this.employeeId && this.mode === Mode.ADD) {
      this.form.controls.employeeId.setValue(this.employeeId);
    }
    this.hiddenEmp = this.data.hiddenEmp;
    this.changeCerTypeSubs();
    this.changeCertificateType();
  }

  initDataSelected() {
    this.categoryService.getList({ isGetAttribute: true }, UrlConstant.CATEGORY.GET_CATEGORIES.replace('{typeCode}', this.categoryCode.LOAI_CHUNG_CHI)).subscribe(res => {
      if (res.code === HTTP_STATUS_CODE.SUCCESS) {
        this.listCertificatesType = res.data;
        let listGroupData = [];
        const listData = res.data.filter(item => {
          if (item.attributes['LA_NGOAI_NGU'] !== 'Y') {
            return true;
          } else {
            listGroupData.push(item);
            return false;
          }
        });

        const listLanguageType: any[] = [{
          isGroup: true,
          groupLabel: this.translate.instant('hrm.staffManager.educationCertificates.table.foreignLanguage'),
          childItem: listGroupData
        }];
        this.listCertificatesTypeGroup = listLanguageType.concat(listData);
      }

    });
  }

  override initForm() {
    this.form = this.fb.group({
      educationCertificateId: [null],
      employeeId: [null, [Validators.required]],
      certificateTypeId: [null, [Validators.required, Validators.maxLength(50)]],
      certificateName: [null, [Validators.maxLength(255)]],
      certificateId: [null, [Validators.required, Validators.maxLength(50)]],
      result: [null],
      issuedPlace: [null, [Validators.maxLength(255), Validators.required]],
      issuedDate: [null, Validators.required],
      expiredDate: [null],
      files: [null, [Validators.required]],
      listAttributes: this.fb.array([])
    }, {
      validators:
        [DateValidator.validateRangeDate('issuedDate', 'expiredDate', 'rangeDateError')]
    });

    this.attributesFormArray = this.form?.get('listAttributes') as FormArray;
  }

  changeCerTypeSubs() {
    this.subscriptions.push(
      this.f.certificateTypeId.valueChanges.pipe(distinctUntilChanged()).subscribe(value => {
        this.listCertificates = [];
        if (value) {
          const url = UrlConstant.CATEGORY.GET_BY_PARENT.replace('{categoryType}', this.categoryCode.TEN_CHUNG_CHI);
          const params = { parentTypeCode: this.categoryCode.LOAI_CHUNG_CHI, parentValue: value, isGetAttribute: true };
          this.dataService.getDataByParam(url, params, this.microService.ADMIN).subscribe(res => {
            if (res.code === HTTP_STATUS_CODE.SUCCESS) {
              this.listCertificates = res.data;
            }
          });
        }
      })
    );
  }

  patchValueInfo() {
    this.form.patchValue(this.data);
    this.f.expiredDate.setValue(this.data.expiredDate);
    this.f.issuedDate.setValue(this.data.issuedDate);
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

  changeCertificateType() {
    this.subscriptions.push(
      this.f.certificateTypeId.valueChanges.pipe(distinctUntilChanged()).subscribe(event => {
        if (this.attributesFormArray?.length > 0) {
          while (this.attributesFormArray?.length !== 0) {
            this.attributesFormArray?.removeAt(0);
          }
        }
        this.functionCodeCertificateType = event;
        this.getConfigAttributes(this.isLoadData);
        this.isLoadData = false;
        const categoryType: any = this.listCertificatesType.find(item => item.value === event);
        if (event === Constant.OTHER_VALUE || (categoryType?.attributes && categoryType?.attributes['CHO_NHAP_TEXT'] === 'Y')) {
          this.configShowForm.certificateId = false;
          this.configShowForm.certificateName = true;
          this.configShowForm.certificateResult = false;
          this.f.certificateId?.setValidators(null);
          this.f.certificateId?.reset(null);
          this.f.certificateName?.addValidators([Validators.required]);
        } else {
          this.configShowForm.certificateId = true;
          this.configShowForm.certificateName = false;
          this.f.certificateId?.setValidators([Validators.required]);
          this.f.certificateId?.reset(null);
          this.f.certificateName?.setValidators(null);
        }
        if (categoryType?.attributes && categoryType?.attributes['LABEL_TEN_CHUNG_CHI']) {
          this.labelCertificate = categoryType?.attributes['LABEL_TEN_CHUNG_CHI'];
        } else {
          this.labelCertificate = this.translate.instant('hrm.staffManager.educationCertificates.table.certificateName');
        }
        this.f.certificateId.updateValueAndValidity();
        this.f.certificateName.updateValueAndValidity();
      })
    );
  }

  changeCertificate(event: SelectModal) {
    const valueSelected = event?.itemSelected?.value;
    if (valueSelected === Constant.OTHER_VALUE) {
      this.f.certificateName?.addValidators([Validators.required]);
      this.configShowForm.certificateName = true;
    } else {
      this.f.certificateName?.setValidators(null);
      this.configShowForm.certificateName = false;
    }
    this.f.certificateName?.updateValueAndValidity();

    this.f.result?.setValidators(null);
    this.configShowForm.certificateResult = false;
    if (event?.itemSelected?.attributes) {
      const listResult = event?.itemSelected?.attributes?.['TRINH_DO']?.split(',') ?? [];
      this.isInputTextResult = event?.itemSelected?.attributes?.['NHAP_TRINH_DO'] === 'Y';
      this.listCertificateResult = [];
      listResult?.forEach(item => {
        if (!StringUtils.isNullOrEmpty(item)) {
          this.listCertificateResult.push({ name: item?.trim() });
        }
      });
      if (this.listCertificateResult.length > 0 || this.isInputTextResult) {
        this.f.result?.addValidators([Validators.required]);
        this.configShowForm.certificateResult = true;
      }
      if (!this.listCertificateResult.some(item => item.name === this.f.result.value)) {
        this.f.result.reset();
      }
      this.ref.detectChanges();
    }
    this.f.result?.updateValueAndValidity();
  }

  beforeSave() {
    if (!this.configShowForm.certificateName) {
      this.f.certificateName.reset(null);
    }
    if (!this.configShowForm.certificateId) {
      this.f.certificateId.reset(null);
    }
    if (!this.configShowForm.certificateResult) {
      this.f.result.reset(null);
    }
    const data = this.form.value;
    delete data?.files;
    this.body = {
      id: this.body.educationCertificateId,
      data: { ...data, attachmentDeleteIds: this.docIdsDelete },
      files: this.f.files.value?.filter(item => item instanceof File)
    };
  }
}
