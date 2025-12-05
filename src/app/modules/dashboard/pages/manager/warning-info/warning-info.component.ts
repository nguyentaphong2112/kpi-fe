import { Component, HostListener, Injector, OnInit, ViewChild } from '@angular/core';
import { WarningConfigsService } from '@app/modules/dashboard/data-access/services/warning-configs.service';
import { WarningConfig } from '@app/modules/dashboard/data-access/models/warning-config';
import { BaseComponent } from '@core/components/base.component';
import { catchError, delay, map } from 'rxjs/operators';
import { Observable, of, throwError } from 'rxjs';
import { WarningService } from '@app/modules/dashboard/data-access/services/warning.service';
import { StorageService } from '@core/services/storage.service';
import { HbtTableComponent } from '@shared/component/hbt-table/hbt-table.component';
import { HBTTableConfig, HBTTableHeader } from '@shared/component/hbt-table/hbt-table.interfaces';
import { CommonUtils } from '@shared/services/common-utils.service';
import { BaseResponse } from '@core/models/base-response';
import { Pagination } from '@shared/model/pagination';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { TABLE_CONFIG_DEFAULT } from '@shared/constant/common';
import { SwiperComponent } from 'swiper/angular';

@Component({
  selector: 'app-warning-info',
  templateUrl: './warning-info.component.html',
  styleUrls: ['./warning-info.component.scss']
})
export class WarningInfoComponent extends BaseComponent implements OnInit {

  data$: Record<string, Observable<any>> = {};
  arrWarning: WarningConfig[] = [];
  title = '';
  isVisible = false;
  @ViewChild('tableTmpl') table!: HbtTableComponent;
  @ViewChild('swiperComponent') swiper: SwiperComponent;
  tableConfig: HBTTableConfig;
  tableData = [];
  pagination = new Pagination();
  warningConfigId = null;
  apiUri = null;
  id = null;
  slidesPerView = 6;
  wSpace = 0;
  activeIndex = 0;
  swiperConfig: any = {
    loop: false,
    spaceBetween: this.wSpace,
    virtual: true,
    breakpoints: {
      200: {
        slidesPerView: 1,
        spaceBetween: 0
      },
      360: {
        slidesPerView: 2
      },
      500: {
        slidesPerView: 3
      },
      767: {
        slidesPerView: 4
      },
      992: {
        slidesPerView: this.slidesPerView
      },
      993: {
        slidesPerView: 3
      },
      1100: {
        slidesPerView: 4
      },
      1300: {
        slidesPerView: 6
      },
      1500: {
        slidesPerView: this.slidesPerView
      }
    }
  };

  constructor(injector: Injector, private warningConfigsService: WarningConfigsService, private service: WarningService) {
    super(injector);
  }

  ngOnInit(): void {
    this.warningConfigsService.getList(null, '/list').subscribe(res => {
      this.arrWarning = res.data;
      this.createObservable();
    });
  }

  swipeNext() {
    this.swiper.swiperRef.slideNext();
  }

  swipePrev() {
    this.swiper.swiperRef.slidePrev();
  }

  slideChangeEvent() {
    this.activeIndex = this.swiper.swiperRef.activeIndex;
  }

  createObservable(isManual?: boolean) {
    this.arrWarning.forEach(el => {
      if (StorageService.get(el.resource) && !isManual) {
        this.data$[el.resource] = of(StorageService.get(el.resource));
      } else {
        this.data$[el.resource] = this.service.getCount(el.warningConfigId, '/count', el.apiUri).pipe(
          catchError(err => {
            return of({ data: { total: '0' } });
          }),
          map(respponse => {
            StorageService.set(el.resource, respponse.data?.total);
            return respponse.data?.total ?? '0';
          }));
      }
    });
  }

  openLink(item: WarningConfig) {
    this.router.navigateByUrl(item.urlViewDetail);
  }

  handleCancel() {
    this.isVisible = false;
  }

  export() {
    this.service.exportWarning({ title: this.title }, this.apiUri, '/export/' + this.id).toPromise();
  }

  openPopUp(item: WarningConfig) {
    if (item.isPopup) {
      this.isVisible = true;
      this.title = item.title;
      this.id = item.isShowExcel ? item.warningConfigId : null;
      this.warningConfigId = item.warningConfigId;
      this.apiUri = item.apiUri;
      this.setHeader(item.listColumnTable);
      this.search();
    }
  }

  search(page?: number) {
    this.pagination.pageNumber = page ?? 1;
    this.warningConfigsService.searchPopup({ id: this.warningConfigId }, this.pagination.getCurrentPage(), '/pop-up', this.apiUri)
      .subscribe((res: BaseResponse<any>) => {
          this.tableData = res.data.listData;
          this.tableConfig.total = res.data.total;
          this.tableConfig.pageIndex = res.data.pageIndex;
        }
      );
  }

  offsetWidth = 480;
  currentWidth = window.innerWidth;

  @HostListener(
    'window:resize', ['$event'])
  onWindowResize(event) {
    this.currentWidth = event.target.innerWidth;
    this.resizeConfig();
  }

  resizeConfig() {
    this.offsetWidth = this.currentWidth - 160 - 450;
    this.wSpace = (this.offsetWidth - 6 * 198) / 5;
    if (this.currentWidth < 1441) {
      this.offsetWidth = this.currentWidth - 160 - 315;
      this.wSpace = (this.offsetWidth - 6 * 129) / 5;
    }
    if (this.currentWidth < 1100) {
      this.offsetWidth = this.currentWidth - 160 - 315;
      this.wSpace = (this.offsetWidth - 3 * 198) / 2;
    }
    if (this.currentWidth < 993) {
      this.offsetWidth = this.currentWidth - 48;
      this.wSpace = (this.offsetWidth - 6 * 198) / 5;
    }
    if (this.currentWidth < 992) {
      this.offsetWidth = this.currentWidth - 48;
      this.wSpace = (this.offsetWidth - 4 * 198) / 3;
    }
    if (this.currentWidth < 767) {
      this.offsetWidth = this.currentWidth - 48;
      this.wSpace = (this.offsetWidth - 3 * 198) / 2;
    }
    if (this.currentWidth < 500) {
      this.offsetWidth = this.currentWidth - 48;
      this.wSpace = (this.offsetWidth - 2 * 129) / 1;
    }
  }

  setHeader(column: NzSafeAny) {
    let headers: HBTTableHeader[] = [
      {
        title: 'STT',
        thClassList: ['text-center'],
        tdClassList: ['text-center'],
        fixed: true,
        fixedDir: 'left',
        width: 50,
        rowspan: 2
      }
    ];
    column.forEach(it => {
      headers.push({
        title: it.label,
        field: it.value,
        thClassList: ['text-center'],
        width: 200
      });
    });
    this.tableConfig = {
      headers: headers,
      total: 0,
      needScroll: true,
      loading: false,
      size: 'small',
      pageSize: TABLE_CONFIG_DEFAULT.pageSize,
      pageIndex: 1
    };
  }

  reloadData() {
    this.data$ = {};
    this.createObservable(true);
  }


}
