import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {UrlConstant} from "@shared/constant/url.class";
import {MICRO_SERVICE} from "@core/constant/system.constants";

@Component({
  selector: 'hbt-org-tree',
  templateUrl: './hbt-org-tree.component.html',
  styleUrls: ['./hbt-org-tree.component.scss']
})
export class HbtOrgTreeComponent implements OnInit {
  @Input() scope: string;
  @Input() functionCode: string;
  @Input() isExpand = false;
  @Output() onClickNode = new EventEmitter<any>();

  keyValue = 'nodeId';
  keyLabel = 'name';
  urlLoadDataNode = UrlConstant.ORGANIZATIONS.LOAD_NODE;
  urlLoadChildren = UrlConstant.ORGANIZATIONS.LOAD_CHILDREN;
  serviceName = MICRO_SERVICE.HRM;

  constructor() { }

  ngOnInit(): void {
  }

  selectNode(data) {
    this.onClickNode.emit(data)
  }

}
