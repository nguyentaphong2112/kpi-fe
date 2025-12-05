import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { HttpParams } from '@angular/common/http';
import { NzFormatEmitEvent } from 'ng-zorro-antd/tree';
import { DataService } from '@shared/services/data.service';
import { Subscription } from 'rxjs';
import { AlertModalChangeService } from '@app/modules/hrm/data-access/services/staff-info/alert-modal-change.service';
import { _variable } from '@core/global-style/_variable';

export class ConfigTree {
  asyncData?: boolean = false;
  isCheckbox?: boolean = false;
}

export class NodeInfo {
  key: string;
  code: string;
  title: string;
  expanded: boolean = false;
  totalChildren: number;
  isLeaf: boolean = false;
  children: NodeInfo[] = [];
}

@Component({
  selector: 'hbt-tree-view',
  templateUrl: './hbt-tree-view.component.html',
  styleUrls: ['./hbt-tree-view.component.scss']
})
export class HbtTreeViewComponent implements OnInit {
  private closeOrgSubscription: Subscription;
  @Input() unSelected = true;
  @Input() selectedKeys = [];
  @Input() urlLoadDataNode: string;
  @Input() urlLoadByParentNode: string;
  @Input() serviceName: string;
  @Input() searchText: string = undefined;
  @Input() dataConfig: ConfigTree = { asyncData: true };
  @Input() scope: string;
  @Input() functionCode: string;
  @Input() searchValue: string = '';
  @Input() hideUnMatched = true;
  @Input() keyValue = 'id';
  @Input() keyLabel = 'name';
  @Input() isExpand = false;
  @Input() isClickExpand = false;
  @Output() onClickNode: EventEmitter<any> = new EventEmitter<any>();
  @Output() onDbClickNode: EventEmitter<any> = new EventEmitter<any>();
  @Output() onCheckedNode: EventEmitter<any> = new EventEmitter<any>();
  @Output() initRoodNode: EventEmitter<any> = new EventEmitter<any>();

  isLoading: boolean = true;
  dataTree: NzSafeAny[] = [];
  allData: any[] = [];

  _variable = _variable;
  constructor(private dataService: DataService,
              private alertModalChangeService: AlertModalChangeService) {
  }

  ngOnInit() {
    let params = new HttpParams().set('scope', this.scope ? this.scope : '').set('functionCode', this.functionCode ? this.functionCode : '');

    this.doGetRootNode(params);
    this.onListener(params);
  }

  onListener(params: any) {
    this.closeOrgSubscription = this.alertModalChangeService.closeOrg$.subscribe((res) => {
      if (res) {
        this.doGetRootNode(params);
      }
    });
  }

  async doGetNodeChild(event: NzFormatEmitEvent) {
    if (this.dataConfig.asyncData) {
      event.node.isLoading = true;
      if (event.eventName === 'expand' || event.eventName === 'click') {
        const node = event.node;
        if (event.eventName === 'click') {
          node.isExpanded = true;
        }
        if (node?.getChildren().length === 0 && node?.isExpanded) {
          const node = event.node;
          let nodeChild = await this.searchChildNodeFromAll(node.key);
          if (nodeChild != undefined && nodeChild.length > 0)
            node.addChildren(nodeChild);
          else node.origin.isLeaf = true;
        }
        event.node.isLoading = false;
      } else {
        event.node.isLoading = false;
      }
    }
  }

  doClickNode(data: any) {
    if (this.isClickExpand) {
      this.doGetNodeChild(data);
    }
    if (data.node != undefined && data.node.origin != undefined) {
      if (data?.node?._isSelected || !this.unSelected) {
        this.selectedKeys = [data.node.origin.key];
        const dataSelect = {
          id: data.node.origin.key,
          code: data.node.origin.code,
          name: data.node.origin.title
        };
        this.onClickNode.emit(dataSelect);
      } else {
        this.onClickNode.emit(null);
      }
    }
  }

  doDbClickNode(data: NzSafeAny) {
    if (data.node != undefined && data.node.origin != undefined) {
      const dataSelect = {
        id: data.node.origin.key,
        code: data.node.origin.code,
        name: data.node.origin.title
      };
      this.onDbClickNode.emit(dataSelect);
    }
  }

  doCheckedNode(data: any) {
    if (data != undefined && data.keys.length > 0) {
      this.onCheckedNode.emit(data.keys);
    }
  }

  async doGetRootNode(param: any) {
    try {
      this.isLoading = true;
      const res = await this.dataService.getDataByParam(this.urlLoadDataNode, param, this.serviceName).toPromise();
      this.allData = res.data;
      const tempDataTree = this.parseDataToNode(this.allData);
      if (this.isExpand) {
        for (const item of tempDataTree) {
          item.expanded = true;
          item.children = await this.searchChildNodeFromAll(item.key);
        }
      }
      this.dataTree = tempDataTree;
      this.initRoodNode.emit(this.dataTree);
    } finally {
      this.isLoading = false;
    }
  }

  async doGetByParentNode(parentId: string): Promise<NodeInfo[]> {
    let data = await this.dataService.getDataByParam(this.urlLoadByParentNode + `/${parentId}`, null, this.serviceName).toPromise();
    return this.parseDataToNode(data.data);
  }

  parseDataToNode(raw: any[], expaned?: boolean): NodeInfo[] {
    const listFileOld: NodeInfo[] = [];
    if (raw != undefined && raw.length > 0)
      raw.forEach(item => {
        item.childrens = item['children'] ? item['children'] : item.childrens;
        let node = new NodeInfo();
        node.key = item[this.keyValue];
        node.title = item[this.keyLabel];
        node.code = item.code;
        node.totalChildren = item.totalChildren;
        node.expanded = expaned != undefined ? expaned : false;
        if (item.childrens != undefined && item.childrens.length > 0) {
          node.children = this.parseDataToNode(item.childrens, expaned);
        } else node.isLeaf = false;
        listFileOld.push(node);
      });
    return listFileOld;
  }

  async searchChildNodeFromAll(key: string): Promise<NodeInfo[]> {
    let childNode: NodeInfo[];
    childNode = await this.doGetByParentNode(key);
    return childNode;
  }

}
