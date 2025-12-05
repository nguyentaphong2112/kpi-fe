import { Component, inject, OnInit } from '@angular/core';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { TreeNode } from '@shared/model/tree-node';
import { SelectionModel } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { NzTreeFlatDataSource, NzTreeFlattener } from 'ng-zorro-antd/tree-view';
import { debounceTime, Subject, Subscription } from 'rxjs';
import { RolesService } from '@app/modules/admin/data-access/services/permissions/roles.service';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { ToastrService } from 'ngx-toastr';
import { UrlConstant } from '@app/modules/admin/data-access/constants/url.constant';
import { TranslateService } from '@ngx-translate/core';
import { HTTP_STATUS_CODE } from '@core/constant/system.constants';
import { REQUEST_TYPE } from '@app/shared/constant/common';

interface FlatNode {
  expandable: boolean;
  name: string;
  level: number;
  disabled: boolean;
  nodeId: string;
  checked: boolean;
}

@Component({
  selector: 'app-roles-menu',
  templateUrl: './roles-menu.component.html',
  styleUrls: ['./roles-menu.component.scss']
})
export class RolesMenuComponent implements OnInit {

  constructor(
    private readonly roleService: RolesService,
    private toastService: ToastrService,
    protected modalRef: NzModalRef,
    private translate: TranslateService
  ) {
  }

  roleId!: number;
  listMenus!: TreeNode[];
  menusOrigin!: TreeNode[];
  subs: Subscription[] = [];
  isCollapsed = false;
  flatNodeMap = new Map<FlatNode, TreeNode>();
  nestedNodeMap = new Map<TreeNode, FlatNode>();
  checklistSelection = new SelectionModel<FlatNode>(true);
  treeControl = new FlatTreeControl<FlatNode>(
    (node) => node.level,
    (node) => node.expandable
  );
  valueSearch = new Subject();
  private transformer = (node: TreeNode, level: number): FlatNode => {
    const existingNode = this.nestedNodeMap.get(node);
    const flatNode: NzSafeAny =
      existingNode && existingNode.name === node.name
        ? existingNode
        : {
          expandable: !!node.children && node.children.length > 0,
          name: node.name,
          level,
          nodeId: node.nodeId,
          checked: node.checked
        };
    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);
    return flatNode;
  };

  treeFlattener = new NzTreeFlattener(
    this.transformer,
    (node) => node.level,
    (node) => node.expandable,
    (node) => node.children
  );
  dataSource = new NzTreeFlatDataSource(this.treeControl, this.treeFlattener);

  ngOnInit() {
    this.setDataSource();
    this.valueSearch.pipe(
      debounceTime(500)
    ).subscribe((value: string) => {
      this.filter(value, this.menusOrigin);
    });
  }

  setDataSource() {
    this.dataSource.setData(this.listMenus);
    this.menusOrigin = this.listMenus;
    this.treeControl.expandAll();
    if (this.roleId) {
      this.getMenuOfRole();
    }
  }

  getMenuOfRole() {
    this.subs.push(
      this.roleService.getList(null, UrlConstant.ROLES.GET_TREE_ROLE_BY_ID.replace('{id}', this.roleId.toString()))
        .subscribe(res => {
          if (res.code === HTTP_STATUS_CODE.SUCCESS) {
            this.treeControl.dataNodes.forEach(node => {
              const roleMenus = res.data;
              node.checked = roleMenus.includes(node.nodeId);
              if (node.checked) {
                this.checklistSelection.select(node);
              }
            });
          }
        }, error => {
          this.toastService.error(error.message);
        })
    );
  }

  hasChild = (_: number, node: FlatNode): boolean => node.expandable;

  descendantsAllSelected(node: FlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    return (
      descendants.length > 0 &&
      descendants.some((child) => this.checklistSelection.isSelected(child))
    );
  }

  leafItemSelectionToggle(node: FlatNode): void {
    this.checklistSelection.toggle(node);
    this.checkAllParentsSelection(node);
  }

  itemSelectionToggle(node: FlatNode): void {
    this.checklistSelection.toggle(node);
    const descendants = this.treeControl.getDescendants(node);
    this.checklistSelection.isSelected(node)
      ? this.checklistSelection.select(...descendants)
      : this.checklistSelection.deselect(...descendants);
    descendants.forEach((child) => this.checklistSelection.isSelected(child));
    this.checkAllParentsSelection(node);
  }

  checkAllParentsSelection(node: FlatNode): void {
    let parent: FlatNode | null = this.getParentNode(node);
    while (parent) {
      this.checkRootNodeSelection(parent);
      parent = this.getParentNode(parent);
    }
  }

  checkRootNodeSelection(node: FlatNode): void {
    const nodeSelected = this.checklistSelection.isSelected(node);
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected =
      descendants.length > 0 &&
      descendants.some((child) => this.checklistSelection.isSelected(child));
    if (nodeSelected && !descAllSelected) {
      this.checklistSelection.deselect(node);
    } else if (!nodeSelected && descAllSelected) {
      this.checklistSelection.select(node);
    }
  }

  getParentNode(node: FlatNode): FlatNode | null {
    const currentLevel = node.level;
    if (currentLevel < 1) {
      return null;
    }
    const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;
    for (let i = startIndex; i >= 0; i--) {
      const currentNode = this.treeControl.dataNodes[i];
      if (currentNode.level < currentLevel) {
        return currentNode;
      }
    }
    return null;
  }

  save() {
    const request = {
      nodeIds: this.checklistSelection.selected?.map(item => item.nodeId)
    };
    this.subs.push(
      this.roleService.createOrImport(request, REQUEST_TYPE.DEFAULT, UrlConstant.ROLES.UPDATE_TREE_ROLE_BY_ID.replace('{id}', this.roleId.toString()))
        .subscribe(res => {
          if (res.code === 'SUCCESS') {
            this.toastService.success(this.translate.instant('common.notification.updateSuccess'));
            this.modalRef.close({ refresh: true });
          } else {
            this.toastService.error(res.message);
          }
        }, error => {
          this.toastService.error(error.message);
        })
    );
  }

  searchMenu($event: string) {
    this.valueSearch.next($event);
  }

  filter(text: string, array: TreeNode[]) {
    const getNodes = (result: TreeNode[], object: TreeNode) => {
      if (!text) {
        result.push(object);
        return result;
      } else {
        if (!object.name) {
          object.name = '';
        }
        const index = object.name.toLowerCase().indexOf(text.toLowerCase());
        if (index !== -1) {
          const objectResult = Object.assign({}, object);
          const nameBefore = objectResult.name.substring(0, index);
          const nameHighlight = objectResult.name.substring(index, index + text.length);
          const nameAfter = objectResult.name.substring(index + text.length);
          objectResult.name =
            nameBefore +
            '<span class=\'text__search--highlight\'>' +
            nameHighlight +
            '</span>' +
            nameAfter;
          result.push(objectResult);
          return result;
        }
        if (Array.isArray(object.children)) {
          const children = object.children.reduce(getNodes, []);
          if (children.length) {
            result.push({ ...object, children });
          }
        }
        return result;
      }
    };
    this.listMenus = array.reduce(getNodes, []);
    this.dataSource.setData(this.listMenus);
    this.treeControl.expandAll();
  }
}
