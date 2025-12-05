import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {ActionSchema, ChildLevel2ActionSchema} from "@core/models/action.model";

@Component({
  selector: 'btn-more-action-child',
  templateUrl: './btn-more-action-child.component.html',
  styleUrls: ['./btn-more-action-child.component.scss']
})
export class BtnMoreActionChildComponent implements OnChanges {
  _model: Record<string, any>;
  @Input() setting: ActionSchema;
  @Input() isBtn = false;

  @Input() set model(value: Record<string, any>[]) {
    this._model = value?.reduce((acc, item) => {
      Object.keys(item).forEach(key => {
        acc[key] = item[key];
      });
      return acc;
    }, {});
  }

  disabledAll = false;
  submenuVisible: { [key: number]: boolean } = {};

  ngOnChanges(changes: SimpleChanges) {
    this.disabledAll = this.checkDisableAll();
  }

  checkDisable(disabled: Function): boolean {
    if (disabled && this._model) {
      return disabled(this._model);
    }
    return false;
  }

  checkDisableAll(): boolean {
    return !this.setting.arrAction.some(el => !this.checkDisable(el.disabled));
  }

  checkDisableChildren(children: ChildLevel2ActionSchema[]): boolean {
    return children?.every(child => this.checkDisable(child.disabled));
  }

  handleItemClick(data: any, index: number, event: Event): void {
    event.stopPropagation(); // Ngăn sự kiện lan truyền

    if (data.children?.length > 0 && !this.checkDisableChildren(data.children)) {
      // Chỉ toggle submenu nếu có children
      this.toggleSubmenu(index, event);
    } else {
      // Gọi function nếu không có submenu và không disabled
      if (!this.checkDisable(data.disabled)) {
        data.function(this._model);
      }
    }
  }

  toggleSubmenu(index: number, event: Event): void {
    event.stopPropagation(); // Ngăn sự kiện lan truyền
    this.submenuVisible[index] = !this.submenuVisible[index];
  }

  handleChildClick(child: ChildLevel2ActionSchema, event: Event): void {
    event.stopPropagation(); // Ngăn sự kiện lan truyền
    if (!this.checkDisable(child.disabled)) {
      child.function(this._model);
      this.submenuVisible = {}; // Đóng tất cả submenu
    }
  }
}

