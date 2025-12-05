import { ChangeDetectionStrategy, Component, EventEmitter, Injector, Input, OnInit, Output } from '@angular/core';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { ActionSchema, ChildActionSchema } from '@core/models/action.model';
import { BaseFormComponent } from '@core/components/base-form.component';
import {
  OrganizationEvaluationsModel
} from '@app/modules/kpi/data-access/models/kpi-evaluations/organization-evaluations.model';
import _ from 'lodash';
import { CommonUtils } from '@shared/services/common-utils.service';
import { Mode, REQUEST_TYPE } from '@shared/constant/common';
import { FormArray, FormGroup, Validators } from '@angular/forms';
import { UrlConstant } from '@app/modules/kpi/data-access/constants/url.constant';
import { HTTP_STATUS_CODE, MICRO_SERVICE } from '@core/constant/system.constants';
import { Constant } from '@app/modules/kpi/data-access/constants/constants';
import { CategoriesService } from '@app/modules/kpi/data-access/other-services/categories.service';
import { CategoryModel } from '@core/models/category-common.interface';
import {
  PersonalEvaluationsService
} from '@app/modules/kpi/data-access/services/kpi-evaluations/personal-evaluations.service';
import { distinctUntilChanged } from 'rxjs';
import {
  AlertModalChangeService
} from '@app/modules/kpi/data-access/services/kpi-evaluations/alert-modal-change.service';

@Component({
  selector: 'emp-work-plan',
  templateUrl: './work-plan.component.html',
  styleUrls: ['./work-plan.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorkPlanComponent extends BaseFormComponent<NzSafeAny> implements OnInit {
  readonly FORM_ARRAY_NAME = 'configColumns';
  actionSchema: ActionSchema;
  keyIndex = 1;
  map: Map<string, number> = new Map<string, number>();
  isVisible = false;
  valueSelect: any;
  urlLoadData = UrlConstant.ORGANIZATION_EVALUATION.WORK_PLANNING_TEMPLATE;
  serviceName = MICRO_SERVICE.KPI;
  listDataSelect: CategoryModel[] = [];
  listDataLevel: CategoryModel[] = [];
  isDetail = false;
  isEvaluate = false;
  isEvaluateManage = false;
  isEvaluateDetail = false;
  isTeacherJob = false;
  value = 'value';
  name = 'name';

  @Input() data: any;
  @Input() orderNumber: any;
  @Output() onSave: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(
    injector: Injector,
    private readonly categoryService: CategoriesService,
    private alertModalChangeService: AlertModalChangeService,
    private readonly service: PersonalEvaluationsService
  ) {
    super(injector);
    this.mode = Mode.ADD;
    this.isDetail = this.route.snapshot.queryParams.isDetail;
    this.isEvaluate = this.route.snapshot.queryParams.isEvaluate;
    this.isEvaluateManage = this.route.snapshot.queryParams.isEvaluateManage;
    this.isEvaluateDetail = this.route.snapshot.queryParams.isEvaluateDetail;
    this.isPage = true;
    this.initAction();
    this.getDataSelect();
    this.findOneById = (id) => this.service.findOneById(id);
    this.createApi = (body: OrganizationEvaluationsModel) => this.service.createOrImport(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.FORM_DATA, UrlConstant.EMPLOYEE_EVALUATION.WORK_PLANNING);
    this.updateApi = (body: OrganizationEvaluationsModel) => this.service.update(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.FORM_DATA, UrlConstant.EMPLOYEE_EVALUATION.WORK_PLANNING);
  }

  ngOnInit() {
    if (this.data.isOne) {
      this.alertModalChangeService.resetData();
    }
    super.ngOnInit();
    this.isTeacherJob = this.data.name.includes(this.translate.instant('kpi.employeeEvaluations.label.teacherJob'));
    this.patchValueInit();
  }

  patchValueInit() {
    if (this.data.content) {
      this.patchValue(this.data.content);
    }
  }

  patchValue(data: any) {
    this.isLoading = true;
    this.ref.detectChanges();
    const arrColumn = JSON.parse(data);
    while (this.formArray.length > 0) {
      this.formArray.removeAt(0);
    }
    this.keyIndex = 0;
    this.map = new Map<string, number>();
    for (let index = 0; index < arrColumn.length; index++) {
      const item = arrColumn[index];
      if (item) {
        if (!item?.parentKey) {
          this.keyIndex++;
        } else {
          if (!this.map.get(item.parentKey)) {
            this.map.set(item.parentKey, 1);
          } else {
            this.map.set(item.parentKey, this.map.get(item.parentKey) + 1);
          }
        }
        if (item.param != null) {
          this.initFormArray({ index, ...item }, arrColumn);
        }
      }
    }
    this.isLoading = false;
    this.ref.detectChanges();
  }

  getDataSelect() {
    this.categoryService.getList(null, UrlConstant.CATEGORY.GET_CATEGORIES.replace('{categoryType}', Constant.CATEGORY.KPI_DON_VI_TINH))
      .subscribe(res => {
        if (res.code === HTTP_STATUS_CODE.SUCCESS) {
          this.listDataSelect = res.data;
          this.ref.detectChanges();
        }
      });
    this.categoryService.getList(null, UrlConstant.CATEGORY.GET_CATEGORIES.replace('{categoryType}', Constant.CATEGORY.KPI_LEVEL_COMPLETE))
      .subscribe(res => {
        if (res.code === HTTP_STATUS_CODE.SUCCESS) {
          this.listDataLevel = res.data;
          this.ref.detectChanges();
        }
      });
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  getValueSelect(data: any, value: any, keyValue = 'value', keyLabel = 'label') {
    return data.find(it => it[keyValue] == value) ? data.find(it => it[keyValue] == value)[keyLabel] : '-';
  }

  handleOk(): void {
    if (this.valueSelect) {
      this.patchValue(this.valueSelect);
    } else {
      while (this.formArray.length > 0) {
        this.formArray.removeAt(0);
      }
      this.keyIndex = 0;
      this.map = new Map<string, number>();
      this.initFormArray({ index: 0, key: '1' });
    }
    this.isVisible = false;
  }

  openSelect() {
    this.isVisible = true;
  }


  initAction() {
    this.actionSchema = new ActionSchema({
      arrAction: [
        new ChildActionSchema({
          label: 'Thêm đồng cấp',
          icon: 'plus-circle',
          // isShowFn: this.isShowEdit,
          function: this.add
        }),
        new ChildActionSchema({
          label: 'Thêm con',
          icon: 'plus-circle',
          isShowFn: (item: FormGroup) => {
            return item.value.level < 5;
          },
          function: this.addChild
        }),
        new ChildActionSchema({
          label: 'Lên 1 cấp',
          icon: 'up',
          isShowFn: (item: FormGroup) => {
            return item.value.level > 1;
          },
          function: this.moveUp
        }),
        new ChildActionSchema({
          label: 'Xuống 1 cấp',
          icon: 'down',
          isShowFn: (item: FormGroup) => {
            return (item.value.level < 5
                && this.formArray.value.some(it => it.parentKey == item.value.parentKey && it.key != item.value.key))
              && (this.getMaxLevelDescendant(this.formArray, item.value.key, item.value.level) + Number(item.value.level) <= 5);
          },
          function: this.moveDown
        }),
        new ChildActionSchema({
          label: 'common.button.delete',
          icon: 'delete',
          // isShowFn: this.isShowDelete,
          function: this.onDelete
        })
      ]
    });
  }

  override initForm() {
    this.form = this.fb.group({
      employeeWorkPlanningId: [this.data.employeeWorkPlanningId],
      employeeEvaluationId: [this.route.snapshot.queryParams.employeeEvaluationId],
      isEvaluate: [this.isEvaluate ? 'Y' : null],
      name: [this.data.name],
      percent: [this.data.percent],
      orderNumber: [this.orderNumber],
      configColumns: this.fb.array([])
    });
    this.ref.detectChanges();
  }

  get formArray(): FormArray {
    return this.form.controls[this.FORM_ARRAY_NAME] as FormArray;
  }


  initFormArray = (item, arr?: any) => {
    // let isRequired = true;
    // if (arr) {
    //   isRequired = !arr.some(el => el.parentKey === item.key);
    // }
    // if (this.isTeacherJob) {
    //   isRequired = item.stepOne || item.stepTwo || item.fullYear;
    // }
    let isRequired = item.stepOne || item.stepTwo || item.fullYear;

    const controlsConfig: any = {};
    const resultManage = item.resultManage || (this.isEvaluateManage ? item.result : null);
    controlsConfig.key = [item.key != null ? item.key : null];
    controlsConfig.parentKey = [item.parentKey != null ? item.parentKey : null];
    controlsConfig.level = [item.parentKey != null ? item.parentKey.toString().split('.').length + 1 : 1];
    controlsConfig.param = [item.param ? item.param : null, [Validators.required]];
    controlsConfig.note = [item.note ? item.note : null];
    controlsConfig.unit = [item.unit ? item.unit : null];
    controlsConfig.result = [item.result ? item.result : null, (this.isEvaluate && isRequired && !!item.fullYear) ? [Validators.required] : []];
    controlsConfig.resultManage = [resultManage, (this.isEvaluateManage && isRequired && !!item.fullYear) ? [Validators.required] : []];
    controlsConfig.selfPoint = [item.selfPoint ? item.selfPoint : null];
    controlsConfig.managePoint = [item.managePoint ? item.managePoint : null];
    controlsConfig.stepOne = [item.stepOne ? item.stepOne : null];
    controlsConfig.stepTwo = [item.stepTwo ? item.stepTwo : null];
    controlsConfig.fullYear = [item.fullYear ? item.fullYear : null];
    controlsConfig.isNumber = [item.fullYear ? !isNaN(item.fullYear) : false];
    controlsConfig.listIdRelated = [item.listIdRelated ? item.listIdRelated : null];
    const profile = this.fb.group(controlsConfig);
    this.formArray.insert(item.index, profile);
    if (this.isEvaluate) {
      this.changeResult(item.result, profile, 'selfPoint');
    }
    if (this.isEvaluateManage) {
      this.changeResult(resultManage, profile, 'managePoint');
    }
    this.subscriptions.push(
      profile.get('result')?.valueChanges?.pipe(distinctUntilChanged()).subscribe(value => {
        this.changeResult(value, profile, 'selfPoint');
      })
    );
    this.subscriptions.push(
      profile.get('resultManage')?.valueChanges?.pipe(distinctUntilChanged()).subscribe(value => {
        this.changeResult(value, profile, 'managePoint');
      })
    );
  };

  add = (item: FormGroup) => {
    this.isSubmitted = true;
    if (this.formArray.valid) {
      const parentKey = _.clone(item.controls.parentKey.value);
      let key = _.clone(item.controls.key.value);
      if (parentKey == null) {
        key = (this.keyIndex + 1).toString();
        this.keyIndex = this.keyIndex + 1;
      } else {
        this.map.set(parentKey, this.map.get(parentKey) + 1);
        key = parentKey + '.' + this.map.get(parentKey);
      }
      const dataArr = _.clone([...this.formArray.value, { key: key, parentKey: key }]);
      this.sort(dataArr);
      const index = dataArr.findIndex(el => el.key === key);
      this.initFormArray({ index, key: key, parentKey: parentKey });
      this.isSubmitted = false;
    }
  };

  sort(data) {
    data.sort((a, b) => {
      // Tách các phần của key ra để so sánh
      const keyA = a.key.split('.').map(Number);
      const keyB = b.key.split('.').map(Number);

      // So sánh từng phần của key
      for (let i = 0; i < Math.min(keyA.length, keyB.length); i++) {
        if (keyA[i] < keyB[i]) {
          return -1;
        }
        if (keyA[i] > keyB[i]) {
          return 1;
        }
      }

      // Nếu một key là phần của key kia (ví dụ: "0-1" và "0-1-0")
      return keyA.length - keyB.length;
    });
  }

  addChild = (item: FormGroup) => {
    if (item.value.level === 5) {
      return;
    }
    item.controls['unit'].setValue(null);
    item.controls['stepOne'].setValue(null);
    item.controls['stepTwo'].setValue(null);
    item.controls['fullYear'].setValue(null);
    item.controls['note'].setValue(null);
    this.isSubmitted = true;
    if (this.formArray.valid) {
      const parentKey = _.clone(item.controls.key.value);
      let key;
      if (this.map.get(parentKey) != null) {
        this.map.set(parentKey, this.map.get(parentKey) + 1);
        key = parentKey + '.' + this.map.get(parentKey);
      } else {
        this.map.set(parentKey, 1);
        key = parentKey.toString() + '.' + 1;
      }
      const dataArr = _.clone([...this.formArray.value, { key, parentKey: parentKey }]);
      this.sort(dataArr);
      const index = dataArr.findIndex(el => el.key === key);
      this.initFormArray({ index, key, parentKey: parentKey });
      this.isSubmitted = false;
    }
  };

  onDelete = (data: FormGroup) => {
    this.popupService.showModalConfirmDelete(() => {
      const indexes: number[] = this.getDescendantIndexes(this.formArray, data.value.key);
      indexes.push(data['key']);
      indexes.sort((a: number, b: number) => b - a);
      for (const index of indexes) {
        this.map.delete(this.formArray.at(index).value.key);
        this.formArray.removeAt(index);
      }
      if (this.formArray.length === 0) {
        this.keyIndex = 1;
        this.initFormArray({ index: 0, key: '1' });
      } else {
        if (data.value.parentKey == null) {
          this.keyIndex--;
        }
        this.updateKeyAndParentKey(data);
        if (this.map.get(data.value.parentKey) == 0) {
          for (let i = 0; i < this.formArray.length; i++) {
            const currentItem = this.formArray.at(i).value;
            if (currentItem.key == data.value.parentKey) {
              this.formArray.at(i).get('unit').setValue(null);
              this.formArray.at(i).get('stepOne').setValue(null);
              this.formArray.at(i).get('stepTwo').setValue(null);
              this.formArray.at(i).get('fullYear').setValue(null);
              this.formArray.at(i).get('note').setValue(null);
            }
          }
        }
      }
    });
  };


  moveUp = (item: FormGroup) => {
    const data = _.clone(item.value);
    const parentValue = this.formArray.value.find(el => el.key === data.parentKey);
    const parentKey = parentValue.parentKey;
    const indexes: number[] = this.getDescendantIndexes(this.formArray, data.key);
    const lastParentKey = data.key;
    if (parentValue.level == 1) {
      data.key = (Number(data.parentKey) + 1).toString();
      this.keyIndex = this.keyIndex + 1;
    } else {
      data.key = parentKey + '.' + (Number(data.parentKey.split('.').pop()) + 1).toString();
      this.map.set(parentKey, this.map.get(data.parentKey));
    }

    this.updateKeyAndParentKey({ value: parentValue } as FormGroup, true);

    const listChildData = this.updateKeysForDescendants(indexes, lastParentKey, data.key);
    const dataArr = _.clone([...this.formArray.value, ...listChildData, { key: data.key, parentKey: parentKey }]);
    this.sort(dataArr);
    const index = dataArr.findIndex(el => el.key === data.key);
    const dataItem = { ...data, index, key: data.key, parentKey: parentKey, level: parentValue.level };
    this.initFormArray(dataItem, dataArr);
    if (listChildData) {
      listChildData.forEach(it => {
        const index = dataArr.findIndex(el => el.key === it.key);
        const dataChild = { ...it, index };
        this.initFormArray(dataChild, dataArr);
      });
    }

    this.onDeleteNotConfirm(item);
    this.isSubmitted = false;
    setTimeout(() => {
      this.resetFormArray();
    });
  };


  resetFormArray() {
    const arrColumn = _.clone([...this.formArray.value]);
    while (this.formArray.length > 0) {
      this.formArray.removeAt(0);
    }
    this.keyIndex = 0;
    this.map = new Map<string, number>();
    arrColumn.forEach((item, index) => {
      if (!item.parentKey) {
        this.keyIndex++;
      } else {
        if (!this.map.get(item.parentKey)) {
          this.map.set(item.parentKey, 1);
        } else {
          this.map.set(item.parentKey, this.map.get(item.parentKey) + 1);
        }
      }
      this.initFormArray({ index, ...item }, arrColumn);
    });
  }

  updateKeysForDescendants = (indexes: number[], lastParentKey: string, newParentKey: string, isDown = false) => {
    const listData = [];
    indexes.forEach(index => {
      const descendant = _.clone(this.formArray.value[index]);
      if (descendant.parentKey.startsWith(lastParentKey)) {
        const indexParent = descendant.parentKey.indexOf(lastParentKey);
        descendant.parentKey = newParentKey + descendant.parentKey.substring(indexParent + lastParentKey.length);
        descendant.level = isDown ? descendant.level + 1 : descendant.level - 1;
        if (this.map.get(descendant.parentKey) != null) {
          this.map.set(descendant.parentKey, this.map.get(descendant.parentKey) + 1);
          descendant.key = descendant.parentKey + '.' + this.map.get(descendant.parentKey);
        } else {
          this.map.set(descendant.parentKey, 1);
          descendant.key = descendant.parentKey + '.' + 1;
        }
        listData.push(descendant);
      }
    });
    this.sort(listData);
    return listData;
  };

  moveDown = (item: FormGroup) => {
    const data = _.clone(item.value);
    const moveValue =
      this.formArray.value.find(el => el.parentKey == data.parentKey
        && (Math.abs(Number(el.key.split('.').pop()) - Number(data.key.split('.').pop())) == 1));
    const maxLevelItem = this.getMaxLevelDescendant(this.formArray, data.key, data.level);
    if (maxLevelItem + Number(data.level) > 5) {
      return;
    }
    const indexes: number[] = this.getDescendantIndexes(this.formArray, data.key);
    const lastParentKey = data.key;
    if (moveValue.level == 1) {
      this.keyIndex = this.keyIndex - 1;
    }
    data.parentKey = moveValue.key;
    data.level = data.level + 1;
    if (this.map.get(data.parentKey) != null) {
      this.map.set(data.parentKey, this.map.get(data.parentKey) + 1);
      data.key = data.parentKey + '.' + this.map.get(data.parentKey);
    } else {
      this.map.set(data.parentKey, 1);
      data.key = data.parentKey + '.' + 1;
    }
    const listChildData = this.updateKeysForDescendants(indexes, lastParentKey, data.key, true);
    const dataArr = _.clone([...this.formArray.value, ...listChildData, { key: data.key, parentKey: data.parentKey }]);
    this.sort(dataArr);
    const index = dataArr.findIndex(el => el.key === data.key);
    const dataItem = { ...data, index };
    this.initFormArray(dataItem, dataArr);
    if (listChildData) {
      listChildData.forEach(it => {
        const index = dataArr.findIndex(el => el.key === it.key);
        const dataChild = { ...it, index };
        this.initFormArray(dataChild, dataArr);
      });
    }
    this.onDeleteNotConfirm(item);
    this.isSubmitted = false;
  };

  onDeleteNotConfirm = (data: FormGroup) => {
    const indexes: number[] = this.getDescendantIndexes(this.formArray, data.value.key);
    const dataIndex = this.formArray.value.findIndex(it => it.key == data.value.key);
    indexes.push(dataIndex);
    indexes.sort((a: number, b: number) => b - a);

    for (const index of indexes) {
      this.map.delete(this.formArray.at(index).value.key);
      this.formArray.removeAt(index);
    }
    if (this.formArray.length === 0) {
      this.keyIndex = 1;
      this.initFormArray({ index: 0, key: '1' });
    } else {
      if (data.value.parentKey == null) {
        this.keyIndex--;
      }
      this.updateKeyAndParentKey(data);
      if (this.map.get(data.value.parentKey) == 0) {
        for (let i = 0; i < this.formArray.length; i++) {
          const currentItem = this.formArray.at(i).value;
          if (currentItem.key == data.value.parentKey) {
            this.formArray.at(i).get('unit').setValue(null);
            this.formArray.at(i).get('stepOne').setValue(null);
            this.formArray.at(i).get('stepTwo').setValue(null);
            this.formArray.at(i).get('fullYear').setValue(null);
            this.formArray.at(i).get('note').setValue(null);
          }
        }
      }
    }
  };

  getMaxLevelDescendant(formArray: FormArray, key: string, level: number): number {
    const queue: string[] = [key];
    let maxLevel = level;
    while (queue.length) {
      const currentKey = queue.shift()!;
      for (let i = 0; i < formArray.length; i++) {
        const currentItem = formArray.at(i).value;
        if (currentItem.parentKey === currentKey) {
          if (maxLevel < Number(currentItem.level)) {
            maxLevel = Number(currentItem.level);
          }
          queue.push(currentItem.key);
        }
      }
    }

    return maxLevel;
  }

  updateKeyAndParentKey(data: FormGroup, isIncrease = false) {
    const arrIndexUpdateKey = this.getIndexesAfterKey(this.formArray, data.value.key, data.value.parentKey);
    if (data.value.parentKey) {
      this.map.set(data.value.parentKey, this.map.get(data.value.parentKey) - 1);
    }
    if (isIncrease) {
      arrIndexUpdateKey.reverse();
    }

    arrIndexUpdateKey.forEach((i, index) => {
      const arr = data.value.key.split('.');
      arr[arr.length - 1] = String(Number(arr[arr.length - 1]) + (isIncrease ? arrIndexUpdateKey.length - index + 1 : index));
      this.updateByIndex(i, arr.join('.'));
    });
  }

  updateByIndex(index: number, nextKey: string) {
    const currentKey = _.clone(this.formArray.at(index).get('key').value);
    this.map.set(nextKey, this.map.get(currentKey));
    this.map.delete(currentKey);
    this.formArray.at(index).get('key').setValue(nextKey);
    const arrayChildIndex = this.getDescendantIndexes(this.formArray, currentKey);
    if (arrayChildIndex.length > 0) {
      arrayChildIndex.forEach(i => {
        const keyValue = this.formArray.at(i).get('key').value;
        const keyValueOld = _.clone(this.formArray.at(i).get('key').value);
        if (this.map.has(keyValueOld)) {
          this.map.set(keyValue.replace(currentKey, nextKey), this.map.get(keyValueOld));
          this.map.delete(keyValueOld);
        }
        this.formArray.at(i).get('key').setValue(keyValue.replace(currentKey, nextKey));
        const parentKeyValue = this.formArray.at(i).get('parentKey').value;
        this.formArray.at(i).get('parentKey').setValue(parentKeyValue.replace(currentKey, nextKey));
      });
    }
  }

  getIndexesAfterKey(formArray: FormArray, key: string, parentKey: string) {
    const targetIndex = [];

    for (let i = 0; i < formArray.length; i++) {
      const currentItem = formArray.at(i).value;

      // So sánh parentKey và key
      if (currentItem.parentKey === parentKey && this.compareKeys(currentItem.key, key) > 0) {
        targetIndex.push(i);
      }
    }

    return targetIndex;
  }

  compareKeys(a: string, b: string): number {
    const parseKey = (key: string): number[] => key.split('.').map(Number);

    const aParts = parseKey(a);
    const bParts = parseKey(b);

    for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
      const numA = aParts[i] ?? 0;
      const numB = bParts[i] ?? 0;
      if (numA > numB) return 1;
      if (numA < numB) return -1;
    }
    return 0;
  }

  getDescendantIndexes(formArray: FormArray, key: string): number[] {
    const indexes: number[] = [];
    const queue: string[] = [key];

    while (queue.length) {
      const currentKey = queue.shift()!;
      for (let i = 0; i < formArray.length; i++) {
        const currentItem = formArray.at(i).value;
        if (currentItem.parentKey === currentKey) {
          indexes.push(i);
          queue.push(currentItem.key);
        }
      }
    }

    return indexes;
  }

  getKeyByIndex(key: string) {
    const characters = 'abcdefghijklmnopqrstuvwxyz';
    const arrIndex = key.split('.');
    const index = Number(arrIndex[arrIndex.length - 1]);
    return characters.substring(index - 1, index) + ')';
  }

  beforeSave() {
    this.body.content = JSON.stringify(this.body.configColumns);
    delete this.body.configColumns;
  }

  afterSave() {
    this.onSave.emit(true);
  }

  changeResult($event: NzSafeAny, data: NzSafeAny, name: string) {
    if ($event != null && $event != '') {
      // if (parseFloat($event) > parseFloat(data.get('fullYear').value)) {
      //   data.get(name).setValue('1');
      // } else if (parseFloat($event) < parseFloat(data.get('fullYear').value)) {
      //   data.get(name).setValue('3');
      // } else {
      //   data.get(name).setValue('2');
      // }
      if (data.get('isNumber').value) {
        if (parseFloat(data.get('fullYear').value) != 0) {
          if (['25', '6', '179', '29', '11', '57'].includes(data.get('unit').value)) {
            const value = $event != 0 ? Number(((parseFloat(data.get('fullYear').value) / parseFloat($event)) * 100).toFixed(2)) : 120;
            data.get(name).setValue(value > 100 ? 120 : value);
          } else {
            data.get(name).setValue(Number(((parseFloat($event) / parseFloat(data.get('fullYear').value)) * 100).toFixed(2)));
          }
        } else {
          if (['25', '6', '179', '29', '11', '57'].includes(data.get('unit').value)) {
            const value = $event != 0 ? Number(((parseFloat(data.get('fullYear').value) / parseFloat($event)) * 100).toFixed(2)) : 100;
            data.get(name).setValue(value > 100 ? 120 : value);
          } else {
            data.get(name).setValue(null);
          }
        }
      } else {
        if (data.get('fullYear').value != null) {
          data.get(name).setValue($event);
        } else if ($event != 0) {
          data.get(name).setValue(120);
        } else {
          data.get(name).setValue(null);
        }
      }
    } else {
      data.get(name).setValue(null);
    }

    if (this.isEvaluateManage && name == 'managePoint') {
      this.changeKHCT(name);
    }
    if (!this.isEvaluateManage && name == 'selfPoint') {
      this.changeKHCT(name);
    }
  }

  changeKHCT(name: string) {
    let result;
    if (this.isTeacherJob) {
      let isValid = true;
      this.formArray.controls.forEach(it => {
        if (it.get(name).value != null && it.get(name).value != undefined && !this.isInvalid(it.get('listIdRelated').value) && ((this.compareKeys(it.get('key').value, '4') >= 0 && this.compareKeys(it.get('key').value, '5') < 0)
          || (this.compareKeys(it.get('key').value, '6') >= 0 && this.compareKeys(it.get('key').value, '7') < 0))) {
          isValid = false;
        }
      });
      if (this.data.isProbationary == 'Y') {
        let length = 0;
        let sum = 0;
        this.formArray.controls.forEach(it => {
          if (it.get(name).value != null && it.get(name).value != undefined && (isValid || !this.isInvalid(it.get('listIdRelated').value))) {
            if ((this.compareKeys(it.get('key').value, '4') >= 0 && this.compareKeys(it.get('key').value, '5') < 0) || (this.compareKeys(it.get('key').value, '6') >= 0 && this.compareKeys(it.get('key').value, '7') < 0)) {
              sum += parseFloat(it.get(name).value);
              length++;
            } else if (this.compareKeys(it.get('key').value, '8') >= 0 && this.compareKeys(it.get('key').value, '10') < 0) {
              sum += parseFloat(it.get(name).value);
              length++;
            }
          }
        });
        result = length > 0 ? sum / length : 0;
      } else {
        let length1 = 0;
        let sum1 = 0;
        let length2 = 0;
        let sum2 = 0;
        let length3 = 0;
        let sum3 = 0;
        this.formArray.controls.forEach(it => {
          if (it.get(name).value != null && it.get(name).value != undefined && (isValid || !this.isInvalid(it.get('listIdRelated').value))) {
            if (this.compareKeys(it.get('key').value, '1') >= 0 && this.compareKeys(it.get('key').value, '4') < 0) {
              sum1 += parseFloat(it.get(name).value);
              length1++;
            } else if ((this.compareKeys(it.get('key').value, '4') >= 0 && this.compareKeys(it.get('key').value, '5') < 0) || (this.compareKeys(it.get('key').value, '6') >= 0 && this.compareKeys(it.get('key').value, '7') < 0)) {
              sum2 += parseFloat(it.get(name).value);
              length2++;
            } else if (this.compareKeys(it.get('key').value, '8') >= 0 && this.compareKeys(it.get('key').value, '10') < 0) {
              sum3 += parseFloat(it.get(name).value);
              length3++;
            }
          }
        });
        result = (length1 > 0 ? (sum1 / length1) * 0.5 : 0) + (length2 > 0 ? (sum2 / length2) * 0.4 : 0) + (length3 > 0 ? (sum3 / length3) * 0.1 : 0);
      }
      result = this.data.isOne ? result.toFixed(2) : (result * this.f['percent'].value / 100).toFixed(2);
      this.alertModalChangeService.saveValueGV(result);
    } else {
      let length = 0;
      let sum = 0;
      this.formArray.controls.forEach(it => {
        if (it.get(name).value != null && it.get(name).value != undefined) {
          sum += parseFloat(it.get(name).value);
          length++;
        }
      });
      result = length > 0 ? sum / length : 0;
      result = this.data.isOne ? result.toFixed(2) : (result * this.f['percent'].value / 100).toFixed(2);
      this.alertModalChangeService.saveValueHC(result);
    }
  }

  isInvalid(listIdRelated: NzSafeAny) {
    return (listIdRelated && listIdRelated?.length > 0 && this.data.isJobFree == 'N') ? this.data?.empEvaluationIds.some(it => listIdRelated.includes(it)) : false;
  }

}
