import {Component, Injector, OnInit} from '@angular/core';
import {FormArray, FormGroup, ValidatorFn, Validators} from "@angular/forms";
import {MentoringTrainersModel} from "../../../../data-access/models/mentorings/mentoring-trainers.model";
import {MentoringTrainersService} from "../../../../data-access/services/mentorings/mentoring-trainers.service";
import {BaseFormComponent} from "@core/components/base-form.component";
import {DateValidator} from "@shared/custom-validator/dateValidator.class";
import {MICRO_SERVICE} from "@core/constant/system.constants";
import {CommonUtils} from "@shared/services/common-utils.service";
import {Mode, REQUEST_TYPE} from "@shared/constant/common";
import {DataService} from "@shared/services/data.service";
import {FunctionCode} from "@shared/enums/enums-constant";
import {Scopes} from "@core/utils/common-constants";

@Component({
  selector: 'mts-form',
  templateUrl: './mts-form.component.html',
  styleUrls: ['./mts-form.component.scss']
})
export class MtsFormComponent extends BaseFormComponent<MentoringTrainersModel> implements OnInit {
  functionCodeEmployee = FunctionCode.HR_PERSONAL_INFO;
  scope: string = Scopes.VIEW;
  serviceName = MICRO_SERVICE.LMS
  urlLoadData = '/mentoring-trainers'

  constructor(
    private readonly service: MentoringTrainersService,
    private dataService: DataService,
    injector: Injector
  ) {
    super(injector);
    this.key = 'mentoringTrainerId'

    this.findOneById = (id) => this.service.findOneById(id);
    this.createApi = (body: MentoringTrainersModel) => this.service.createOrImport(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.DEFAULT);
    this.updateApi = (body: MentoringTrainersModel) => this.service.update(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.DEFAULT);
    this.getConfigAttributeApi = () => this.dataService.getAttributeConfig({
      tableName: 'med_object_attributes'
    });
    this.getConfigAttributes();

  }

  override initForm() {
    this.form = this.fb.group({
      mentoringTrainerId: [null],
      employeeId: [null],
      roleId: [null],
      startDate: [null, [Validators.required]],
      endDate: [null, [Validators.required]],
      majorId: [null, [Validators.required, Validators.maxLength(20)]],
      hospitalId: [null, [Validators.required, Validators.maxLength(20)]],
      content: [null, [Validators.maxLength(1000)]],
      className: [null, [Validators.required, Validators.maxLength(255)]],
      totalLessons: [null, [Validators.required]],
      totalClasses: [null, [Validators.required]],
      totalStudents: [null, [Validators.required]],
      totalExaminations: [null, [Validators.required]],
      totalSurgeries: [null, [Validators.required]],
      totalTests: [null, [Validators.required]],
      listParticipating: this.fb.array([
          this._createPartici(this.data)
        ], {
          validators: [this.validateDuplicateEmployeeAndRole()]
        }),
      listAttributes: this.fb.array([]),
    },
    {validators:
        [DateValidator.validateRangeDate('startDate', 'endDate', 'rangeDateError')]
    });
    this.attributesFormArray = this.form?.get('listAttributes') as FormArray;
  }

  ngOnInit() {
    super.ngOnInit();
  }


  _createPartici(data: any){
    const partici = this.fb.group({
      employeeId: [null, [Validators.required]],
      roleId:[null, [Validators.required]]
    })
    if (data) {
      partici.patchValue(data);
    }
    return partici;
  }

  get participating() {
    return this.f['listParticipating'] as FormArray;
  }

  addPartici() {
    this.participating.push(this._createPartici(null));
  }

  removePartici(index: number) {
    if (this.participating.length > 1)
      this.participating.removeAt(index);
    else {
      this.participating.removeAt(index);
      this.addPartici();
    }
  }

  validateDuplicateEmployeeAndRole(): ValidatorFn {
    return (formArray: FormArray) => {
      const seenCombinations = new Set();
      for (let i = 0; i < formArray.length; i++) {
        const employeeId = formArray.at(i).get('employeeId')?.value;
        const roleId = formArray.at(i).get('roleId')?.value;
        const combination = `${employeeId}-${roleId}`;

        if (employeeId && roleId) {
          if (seenCombinations.has(combination)) {
            formArray.controls[i].get('roleId')?.setErrors({ duplicate: true });
          } else {
            const roleControl = formArray.controls[i].get('roleId');
            if (roleControl?.errors && roleControl.errors['duplicate']) {
              const existingErrors = roleControl.errors;
              delete existingErrors['duplicate'];
              roleControl.setErrors(Object.keys(existingErrors).length ? existingErrors : null);
            }
            seenCombinations.add(combination);
          }
        }
      }
      return null;
    };
  }



  protected readonly Mode = Mode;
}


