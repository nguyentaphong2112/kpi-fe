import { Component, EventEmitter, Injector, Input, OnChanges, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { OrgService } from '@app/modules/hrm/data-access/services/model-plan/org.service';
import { HTTP_STATUS_CODE } from '@core/constant/system.constants';
import { BaseListComponent } from '@core/components/base-list.component';

@Component({
  selector: 'app-organizations-hierarchy',
  templateUrl: './organizations-hierarchy.component.html',
  styleUrls: ['./organizations-hierarchy.component.scss']
})
export class OrganizationsHierarchyComponent extends BaseListComponent<any> implements OnInit, OnChanges {
  @Input() organizationId: number;
  @Output() changeSelectOrg = new EventEmitter<any>();
  subs: Subscription[] = [];
  hierarchyData: any[] = null;
  constructor(private orgService: OrgService,
              injector: Injector) {
    super(injector);
  }

  ngOnInit(): void {
  }

  ngOnChanges() {
    if (this.organizationId) {
      this.getListOrgHierarchy();
    }
  }

  getListOrgHierarchy() {
    this.subs.push(
      this.orgService.getListOrgHierarchy(this.organizationId).subscribe(res => {
        if (res.code === HTTP_STATUS_CODE.SUCCESS) {
          this.hierarchyData = res.data;
        }
      })
    );
  }

  viewDetail(isEmployee: boolean, data: any) {
    if (!isEmployee) {
      this.changeSelectOrg.emit(data);
    }
  }

}
