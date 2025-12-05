import {Component, Injector, OnInit} from '@angular/core';
import {FormArray, FormGroup, ValidatorFn, Validators} from "@angular/forms";
import {InternshipSessionsModel} from "../../../../data-access/models/internship-managers/internship-sessions.model";
import {InternshipSessionsService} from "../../../../data-access/services/internship-managers/internship-sessions.service";
import {BaseFormComponent} from "@core/components/base-form.component";
import {DateValidator} from "@shared/custom-validator/dateValidator.class";
import {MICRO_SERVICE} from "@core/constant/system.constants";
import {CommonUtils} from "@shared/services/common-utils.service";
import {Mode, REQUEST_TYPE} from "@shared/constant/common";
import { DataService } from '@app/shared/services/data.service';
import { NzSafeAny } from 'ng-zorro-antd/core/types';

@Component({
  selector: 'iss-form',
  templateUrl: './iss-form.component.html',
  styleUrls: ['./iss-form.component.scss']
})
export class IssFormComponent extends BaseFormComponent<InternshipSessionsModel> implements OnInit {

  serviceName = MICRO_SERVICE.LMS
  urlLoadData = '/internship-sessions'
  constructor(
    private readonly service: InternshipSessionsService,
    injector: Injector,
    private dataService: DataService,
  ) {
    super(injector);
    this.isPage = false;
    this.key = 'internshipSessionId'

    this.findOneById = (id) => this.service.findOneById(id);
    this.createApi = (body: InternshipSessionsModel) => this.service.createOrImport(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.FORM_DATA_FILE);
    this.updateApi = (body: InternshipSessionsModel) => this.service.update(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.FORM_DATA_FILE);
    this.getConfigAttributeApi = () => this.dataService.getAttributeConfig({
      tableName: 'lms_internship_sessions'
    });
    this.getConfigAttributes();

  }

  ngOnInit(): void {
      super.ngOnInit();
  }

  override initForm() {
    this.form = this.fb.group({
      internshipSessionId: [null],
      universityId: [null, [Validators.required, Validators.maxLength(20)]],
      sessionName: [null, [Validators.required, Validators.maxLength(255)]],
      startDate: [null, [Validators.required]],
      endDate: [null, [Validators.required]],
      details: this.fb.array([],{validators:[this.validateDuplicateOrgAndMajor()]}),
      fileList: [null],
      listAttributes: this.fb.array([]),

    },
    {validators:
        [DateValidator.validateRangeDate('startDate', 'endDate', 'rangeDateError')]
    });
    this.attributesFormArray = this.form?.get('listAttributes') as FormArray;
    if(this.mode == Mode.ADD){

      this.addOrg();

    }
  }

  afterPatchValue(): void {
      super.afterPatchValue();

        this.data.details.forEach((it: NzSafeAny) => {
            this.addOrg(it);
        })
  }

  validateDuplicateOrgAndMajor(): ValidatorFn {
    return (formArray: FormArray) => {
      const seenCombinations = new Set();
      for (let i = 0; i < formArray.length; i++) {
        const orgId = formArray.at(i).get('orgId')?.value;
        const majorId = formArray.at(i).get('majorId')?.value;
        const combination = `${orgId}-${majorId}`;

        if (orgId && majorId) {
          if (seenCombinations.has(combination)) {
            formArray.controls[i].get('majorId')?.setErrors({ duplicate: true });
          } else {
            const majorControl = formArray.controls[i].get('majorId');
            if (majorControl?.errors && majorControl.errors['duplicate']) {
              const existingErrors = majorControl.errors;
              delete existingErrors['duplicate'];
              majorControl.setErrors(Object.keys(existingErrors).length ? existingErrors : null);
            }
            seenCombinations.add(combination);
          }
        }
      }
      return null;
    };
  }

  _createOrgDetail(data: any){

    const orgDetail = this.fb.group({
      organizationId: [data?.organizationId ?? null, [Validators.required]],
      majorId:[data?.majorId ?? null, [Validators.required]],
      numOfStudents: [data?.numOfStudents ?? null, [Validators.required]]
    })
    return orgDetail;
  }

  get org() {
    return this.f['details'] as FormArray;
  }

  addOrg(it?:any) {
    this.org.push(this._createOrgDetail(it ?? null));
  }

  removeOrg(index: number) {
    if (this.org.length > 1)
      this.org.removeAt(index);
    else {
      this.org.removeAt(index);
      this.addOrg();
    }
  }

  patchValueInfo() {
    this.form.patchValue(this.data);
    this.afterPatchValue();
    const files = this.data.attachFileList?.map(item => {
      return {
        uid: item.attachmentId,
        name: item.fileName,
        checkSum: item.checkSum,
        status: 'done'
      };
    });
    this.f?.files?.setValue(files);
  }

  beforeSave() {

    const data = this.form.value;
    const totalNumOfStudents = this.org.controls.reduce((total, group: FormGroup) => {
      const numOfStudents = Number(group.get('numOfStudents')?.value) || 0; // Get the value or default to 0 if null
      return total + numOfStudents;
    }, 0);

    console.log(totalNumOfStudents);
    this.body = {
      id: this.body.internshipSessionId,
      data: { ...data, attachmentDeleteIds: this.docIdsDelete,totalStudents:totalNumOfStudents },
      files: this.f.files?.value?.filter(item => item instanceof File),

    };
  }
}


