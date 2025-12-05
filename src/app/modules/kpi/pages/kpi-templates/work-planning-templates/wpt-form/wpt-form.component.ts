import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { FormArray, FormGroup, Validators } from '@angular/forms';
import { WorkPlanningTemplatesModel } from '../../../../data-access/models/kpi-templates/work-planning-templates.model';
import {
  WorkPlanningTemplatesService
} from '../../../../data-access/services/kpi-templates/work-planning-templates.service';
import { BaseFormComponent } from '@core/components/base-form.component';
import { HTTP_STATUS_CODE, MICRO_SERVICE } from '@core/constant/system.constants';
import { CommonUtils } from '@shared/services/common-utils.service';
import { Mode, REQUEST_TYPE } from '@shared/constant/common';
import { ActionSchema, ChildActionSchema } from '../../../../../../core/models/action.model';
import _ from 'lodash';
import { UrlConstant } from '@app/modules/kpi/data-access/constants/url.constant';
import { Constant } from '@app/modules/kpi/data-access/constants/constants';
import { CategoriesService } from '@app/modules/kpi/data-access/other-services/categories.service';
import { CategoryModel } from '@core/models/category-common.interface';

@Component({
  selector: 'wpt-form',
  templateUrl: './wpt-form.component.html',
  styleUrls: ['./wpt-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WptFormComponent extends BaseFormComponent<WorkPlanningTemplatesModel> implements OnInit {

  constructor(
    private readonly service: WorkPlanningTemplatesService,
    private readonly categoryService: CategoriesService,
    injector: Injector
  ) {
    super(injector);
    this.isPage = true;
    this.key = 'workPlanningTemplateId';
    this.findOneById = (id) => this.service.findOneById(id);
    this.createApi = (body: WorkPlanningTemplatesModel) => this.service.createOrImport(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.DEFAULT);
    this.updateApi = (body: WorkPlanningTemplatesModel) => this.service.update(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.DEFAULT);
    this.initAction();
    this.getDataSelect();
  }

  get formArray(): FormArray {
    return this.form.controls[this.FORM_ARRAY_NAME] as FormArray;
  }

  readonly FORM_ARRAY_NAME = 'configColumns';
  actionSchema: ActionSchema;
  serviceName = MICRO_SERVICE.KPI;
  urlLoadData = '/evaluation-periods';
  listDataSelect: CategoryModel[] = [];
  keyIndex = 1;
  map: Map<string, number> = new Map<string, number>();

  override initForm() {
    this.form = this.fb.group({
      workPlanningTemplateId: [null],
      name: [null, [Validators.required]],
      type: [null, [Validators.required]],
      code: [null, [Validators.required]],
      configColumns: this.fb.array([])
    });
    if (this.mode === Mode.ADD) {
      this.initFormArray({ index: 0, key: '1' });
    }
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
  }

  override beforePatchValue() {
    this.isLoading = true;
    this.ref.detectChanges();
    if (this.data) {
      this.form.patchValue(this.data);
    }
    const arrColumn = JSON.parse(this.data.content);
    this.formArray.removeAt(0);
    this.keyIndex = 0;
    for (let index = 0; index < arrColumn.length; index++) {
      const item = arrColumn[index];
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
    }
    this.isLoading = false;
    this.ref.detectChanges();
    // this.updateValidate();
  }

  // updateValidate() {
  //   this.formArray.controls.forEach((it, index) => {
  //     const currentKey = _.clone(this.formArray.at(index).get('key').value);
  //     const arrayChildIndex = this.getDescendantIndexes(this.formArray, currentKey);
  //     if (arrayChildIndex.length > 0) {
  //       this.formArray.at(index).get('unit').setValue(null);
  //       this.formArray.at(index).get('unit').clearValidators();
  //       this.formArray.at(index).get('unit').setErrors(null);
  //       this.formArray.at(index).get('fullYear').setValue(null);
  //       this.formArray.at(index).get('fullYear').clearValidators();
  //       this.formArray.at(index).get('fullYear').setErrors(null);
  //     }
  //   });
  // }

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

  initFormArray = (item, arr?: any) => {
    let isRequired = true;
    if (arr) {
      isRequired = !arr.some(el => el.parentKey === item.key);
    }
    const controlsConfig: any = {};
    controlsConfig.key = [item.key != null ? item.key : null];
    controlsConfig.parentKey = [item.parentKey != null ? item.parentKey : null];
    controlsConfig.level = [item.parentKey != null ? item.parentKey.toString().split('.').length + 1 : 1];
    controlsConfig.param = [item.param ? item.param : null];
    controlsConfig.unit = [item.unit ? item.unit : null, null];
    controlsConfig.stepOne = [item.stepOne ? item.stepOne : null];
    controlsConfig.stepTwo = [item.stepTwo ? item.stepTwo : null];
    controlsConfig.fullYear = [item.fullYear ? item.fullYear : null];
    controlsConfig.note = [item.note ? item.note : null];
    const profile = this.fb.group(controlsConfig);
    this.formArray.insert(item.index, profile);
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
    this.ref.detectChanges();
  };

  addChild = (item: FormGroup) => {
    if (item.value.level === 5) {
      return;
    }
    item.controls['unit'].setValue(null);
    item.controls['unit'].clearValidators();
    item.controls['unit'].setErrors(null);
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
    this.ref.detectChanges();
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
      this.ref.detectChanges();
    });
    this.ref.detectChanges();
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
    this.ref.detectChanges();
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
    this.ref.detectChanges();
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
    this.ref.detectChanges();
  }

  onDelete = (data: FormGroup) => {
    this.popupService.showModalConfirmDelete(() => {
      const indexes: number[] = this.getDescendantIndexes(this.formArray, data.value.key);
      indexes.push(data['key'] - 1);
      // Đảm bảo xóa từ cuối danh sách để không làm thay đổi index của các phần tử chưa xóa
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
      this.ref.detectChanges();
    });
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
    this.ref.detectChanges();
  };

  updateKeyAndParentKey(data: FormGroup, isIncrease = false) {
    const arrIndexUpdateKey = this.getIndexesAfterKey(this.formArray, data.value.key, data.value.parentKey);
    if (data.value.parentKey) {
      this.map.set(data.value.parentKey, this.map.get(data.value.parentKey) - 1);
      if (this.map.get(data.value.parentKey) == 0) {
        this.formArray.controls.forEach(el => {
          // if (el.value.key === data.value.parentKey) {
          //   el.get('unit').setValidators(Validators.required);
          //   el.get('unit').updateValueAndValidity();
          // }
        });
      }
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
}


