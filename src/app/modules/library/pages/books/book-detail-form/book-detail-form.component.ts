import { Component, Injector, Input, OnInit } from '@angular/core';
import { BaseListComponent } from '@core/components/base-list.component';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { ActionSchema, ChildActionSchema } from '@core/models/action.model';
import { BookEditionDetailService } from '@app/modules/library/data-access/services/book-edition-detail.service';
import { UrlConstant } from '@app/modules/library/data-access/constants/url.constant';
import { Constant } from '@app/modules/library/data-access/constants/constants';
import { Mode } from '@shared/constant/common';

@Component({
  selector: 'app-book-detail-form',
  templateUrl: './book-detail-form.component.html',
  styleUrls: ['./book-detail-form.component.scss']
})
export class BookDetailFormComponent extends BaseListComponent<NzSafeAny> implements OnInit {
  // type: 'DETAIL' | 'EDIT' | string = 'DETAIL';
  @Input() type: Mode;
  data: any;
  hasDataId = false;

  constructor(injector: Injector,
              private bookEditionDetailService: BookEditionDetailService
  ) {
    super(injector);
    this.initAction();
    this.isCustomSearch = true;
  }


  ngOnInit() {
    super.ngOnInit();
    this.initDataTable();
  }

  initDataTable(page?: number) {
    this.pagination.pageNumber = page ?? 1;
    this.hasDataId = !!this.data.id;
    if (this.hasDataId) {
      this.bookEditionDetailService.getFilterResearch({ editionId: this.data.id }, this.pagination.getCurrentPage(), UrlConstant.BOOK_EDITION_DETAIL.GET_BY_EDITION_ID)
        .subscribe(res => {
          this.tableData = res.data?.listData?.map(item => {
            const statusObj = Constant.STATUS.find(status => status.value === item.status);
            return {
              ...item,
              status: statusObj ? this.translate.instant(statusObj.label) : item.status
            };
          });
          this.tableConfig.total = res.data.total;
          this.tableConfig.pageIndex = res.data.pageIndex;
        });
    }
  }

  initAction() {
    this.actionSchema = new ActionSchema({
      arrAction: [
        new ChildActionSchema({
          label: 'common.button.edit',
          icon: 'edit',
          isShow: !this.objFunction?.edit,
          function: this.doOpenFormEdit
        }),
        new ChildActionSchema({
          label: 'common.button.delete',
          icon: 'delete',
          isShow: !this.objFunction?.delete,
          function: this.deleteItem
        })
      ]
    });
  }

  override setHeaders() {
    this.tableConfig.headers = [
      {
        title: 'STT',
        thClassList: ['text-center'],
        tdClassList: ['text-center'],
        fixed: true,
        fixedDir: 'left',
        width: 50
      },
      {
        title: 'library.details.table.code',
        field: 'bookNo',
        tdClassList: ['text-center'],
        thClassList: ['text-center']
      },
      {
        title: 'library.details.table.status',
        field: 'status',
        tdClassList: ['text-center'],
        thClassList: ['text-center']
      },
      {
        title: 'library.details.table.borrower',
        field: 'borrower',
        tdClassList: ['text-center'],
        thClassList: ['text-center']
      },
      {
        title: 'library.details.table.borrowedDate',
        field: 'borrowedDate',
        tdClassList: ['text-center'],
        thClassList: ['text-center']
      },
      {
        title: 'library.details.table.note',
        field: 'note',
        tdClassList: ['text-center'],
        thClassList: ['text-center']
      },
      {
        title: '',
        tdClassList: ['text-nowrap', 'text-center'],
        thClassList: ['text-nowrap', 'text-center'],
        width: 80,
        remove: this.type !== Mode.EDIT,
        fieldType: 'tdTemplate',
        fieldTypeValue: this.actionTpl,
        fixed: true,
        fixedDir: 'right'
      }
    ];
  }

}
