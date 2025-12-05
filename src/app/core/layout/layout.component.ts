import {
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import * as _ from 'lodash';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { PersonalInformation } from '@core/models/personal-information';
import { SessionService } from '@core/services/session.service';
import { filter, map } from 'rxjs/operators';
import { SessionKey } from '@core/utils/common-constants';
import { HeaderEventEmit } from '@core/layout/header/header-event-emit';
import { CommonUtils } from '@shared/services/common-utils.service';
import { AppFunction } from '@core/models/app-function.interface';
import { StorageService } from '@core/services/storage.service';
import { _variable } from '@core/global-style/_variable';
import { IdleUserCheckService } from '@shared/services/idle-user-check.service';
import { AuthService } from '@shared/services/auth.service';
import { ConfigPageService } from '@core/services/config-page.service';
import { UrlConstant } from '@app/modules/admin/data-access/constants/url.constant';
import { HTTP_STATUS_CODE, MICRO_SERVICE } from '@core/constant/system.constants';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { FileService } from '@shared/component/hbt-upload/file.service';
import { Mode, REQUEST_TYPE } from '@shared/constant/common';
import { DynamicReportService } from '@app/modules/admin/data-access/services/configurations/dynamic-report.service';
import { FunctionCode } from '@app/shared/enums/enums-constant';
import { environment } from '@env/environment';
import { ConfigComponent } from '@core/layout/config/config.component';

export interface IBreadCrumb {
  label: string;
  url: string;
  disabled?: boolean;
}

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LayoutComponent implements OnInit, AfterViewInit, AfterViewChecked, OnDestroy {
  public _variable = _variable;
  pageName: string;
  menus: AppFunction[] = [];
  menusOrigin: AppFunction[] = [];
  menusFlat: AppFunction[] = [];
  openMenuMap: { [menuId: number]: boolean } = {};
  selectedMenu: NzSafeAny;
  selectedMenuId: number;
  currentUrl: string;
  sideBarClass = 'sidebar__primary--no-active';
  sideBarClassMobile = 'sidebar__primary--no-mobile';
  breadcrumbs: IBreadCrumb[];
  isVisible = false;
  isVisibleEdit = false;
  _routerState: string;
  nzWidth = '300px';
  searchResult: PersonalInformation[];
  deviceMobileNotByWidth = false;
  activeRouteData = false;
  isCollapsed = false;
  firstClick = true;
  isPinMenu = false;
  isMobile: NzSafeAny;
  width: number = window.innerWidth;
  height: number = window.innerHeight;
  mobileWidth = 993;
  subs: Subscription[] = [];
  listFile: NzSafeAny[] = [];
  // url = '/v1/attachment-file/download/{attachmentId}/{checksum}';
  fileData: NzSafeAny;
  fileListData: NzSafeAny;
  attachmentDeleteIds = [];
  objFunctionConfig;
  serviceName = MICRO_SERVICE.ADMIN;
  logoPath = '';
  logoCollapsedPath = '';
  formConfig!: { title: string; content: any, isCloseModal?: boolean, config?: any };
  modalRef!: NzModalRef;
  modeConst = Mode;

  @ViewChild('footerCancelTmpl', { static: true }) footerTpl!: TemplateRef<any>;

  constructor(
    private readonly route: Router,
    private readonly activeRoute: ActivatedRoute,
    private readonly translate: TranslateService,
    private readonly session: SessionService,
    private readonly toastr: ToastrService,
    private readonly cdRef: ChangeDetectorRef,
    private readonly http: HttpClient,
    private readonly modal: NzModalService,
    private readonly idleUserCheckService: IdleUserCheckService,
    private readonly auth: AuthService,
    private fileService: FileService,
    private sessionService: SessionService,
    private readonly router: Router,
    private readonly toast: ToastrService,
    private readonly configPageService: ConfigPageService,
    private readonly dynamicReportService: DynamicReportService,
    private el: ElementRef
  ) {
    this.getCurrentUrl(this.route);
    this.checkDevice();
    if (window.innerWidth < this.mobileWidth) {
      this.isMobile = true;
      this.sideBarClassMobile = 'sidebar__primary--mobile';
    }
    this.breadcrumbs = this.buildBreadCrumb(route.url);
    this.getActiveRouteData();
    this.objFunctionConfig = this.sessionService.getSessionData(`FUNCTION_${FunctionCode.SYS_CONFIG_PAGE}`);
    this.logoCollapsedPath = environment.favicon;
    this.logoPath = environment.logoIcon;
  }

  ngOnInit(): void {
    this.initTimer();
    this.route.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => {
          let child = this.activeRoute;
          while (child.firstChild) {
            child = child.firstChild;
          }
          return this.route.url;
        })
      )
      .subscribe((curentRouter: string) => {
        this.breadcrumbs = this.buildBreadCrumb(curentRouter);
        this.getActiveRouteData();
      });
    this.getMenu();
  }

  initTimer() {
    // thời gian rảnh: 60 phút
    this.idleUserCheckService.USER_IDLE_TIMER_VALUE_IN_MIN = 60;
    this.idleUserCheckService.initilizeSessionTimeout();
    this.idleUserCheckService.userIdlenessChecker.subscribe((status: string) => {
      this.initiateFirstTimer(status);
    });
  }

  initiateFirstTimer = (status: string) => {
    switch (status) {
      case 'INITIATE_TIMER':
        break;
      case 'RESET_TIMER':
        break;
      case 'STOPPED_TIMER':
        IdleUserCheckService.runTimer = false;
        this.auth.logout();
        break;
      default:
        break;
    }
  };

  convertToFlat(tree) {
    const data: { [key: string]: object } = {};
    data.subs = Object.assign([], tree);
    const flatten = (subs: any[], extractChildren: { (x: any): any; (arg0: any): any; }) =>
      Array.prototype.concat.apply(
        subs,
        subs?.map((x) => flatten(extractChildren(x) || [], extractChildren))
      );
    const extractChildren = (x) => x.subs;
    return flatten(extractChildren(data), extractChildren).map((x) => delete x.subs && x);
  }

  ngAfterViewInit() {
    if (environment.isPinMenu) {
      this.onPinClick();
    }
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  getMenu() {
    this.menus = this.session.getSessionData(SessionKey.MENU);
    this.menusOrigin = this.session.getSessionData(SessionKey.MENU);
    this.menusFlat = this.convertToFlat(_.cloneDeep(this.session.getSessionData(SessionKey.MENU)));
    this.selectedMenuId = this.menusFlat?.find((item) => item?.menuUri === this.currentUrl)?.menuId; // get selectedMenuId
    this.setOpenMenu(this.menusOrigin);
  }

  headerEventEmit($event: HeaderEventEmit) {
    switch ($event.subject) {
      case 'TRIGGER':
        if (this.isMobile) {
          this.firstClick = false;
          this.isCollapsed = false;
          this.sideBarClass = 'sidebar__primary--active';
          this.setOpenMenu(this.menus);
        }
        break;
      case 'CHAT':
        break;
      default:
        break;
    }
  }

  openHandler(currentMenuItemId: number): void {
    for (const key in this.openMenuMap) {
      if (key !== currentMenuItemId.toString()) {
        this.openMenuMap[key] = false;
      }
    }
    this.setParentMenuOpen(currentMenuItemId, this.menus);
  }

  setParentMenuOpen(menuItemId: number, menus: NzSafeAny[]) {
    return menus?.some((menu) => {
      this.openMenuMap[menu.menuId] = false;
      if (menu.subs && menu.subs.length > 0) {
        this.openMenuMap[menu.menuId] = this.setParentMenuOpen(menuItemId, menu.subs);
        return this.setParentMenuOpen(menuItemId, menu.subs);
      }
      if (menu.menuId === menuItemId) {
        this.openMenuMap[menu.menuId] = true;
        return true;
      }
    });
  }

  clearMenuOpen(childNode: NzSafeAny) {
    const listParent = this.getParentNode(childNode, [childNode.menuId.toString()]);
    for (const key in this.openMenuMap) {
      if (listParent.indexOf(key) === -1) {
        this.openMenuMap[key] = false;
      }
    }
  }

  getParentNode(childNode: NzSafeAny, listParent: NzSafeAny[]) {
    if (childNode && childNode.parentId != null && childNode.parentId !== 0) {
      listParent.push(childNode.parentId.toString());
      const parentNext = this.menusFlat.find((x) => x.menuId === childNode.parentId);
      this.getParentNode(parentNext, listParent);
    }
    return listParent;
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize(event) {
    this.width = event.target.innerWidth;
    this.height = event.target.innerHeight;
    this.isMobile = this.width < this.mobileWidth;
    this.sideBarClassMobile =
      this.width < this.mobileWidth ? 'sidebar__primary--mobile' : 'sidebar__primary--no-mobile';
    this.checkDevice();
    if (!this.isMobile) {
      this.isCollapsed = true;
      this.sideBarClass = 'sidebar__primary--no-active';
    }
  }

  checkDevice() {
    const userAgent = navigator.userAgent;
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(userAgent)) {
      this.deviceMobileNotByWidth = true;
      this.firstClick = true;
    } else {
      this.deviceMobileNotByWidth = false;
      this.firstClick = false;
    }
  }

  getCurrentUrl(router: Router) {
    this._routerState = this.activeRoute.snapshot['_routerState']['url'];
    router.events.subscribe((e) => {
      if (e instanceof NavigationEnd) {
        this.currentUrl = e.url;
      }
    });
  }

  closeMenuMobile() {
    this.sideBarClass = 'sidebar__primary--no-active';
    this.firstClick = true;
  }

  setOpenMenuMap(menus: NzSafeAny) {
    if (this.isMobile) {
      return false;
    }
    return menus?.some((menu) => {
      this.openMenuMap[menu.menuId] = false;
      if (menu.subs && menu.subs.length > 0) {
        this.openMenuMap[menu.menuId] = this.setOpenMenuMap(menu.subs);
        return this.setOpenMenuMap(menu.subs);
      }
      if (this.currentUrl !== '/' && menu.menuUri === this.currentUrl) {
        this.openMenuMap[menu.menuId] = true;
        return true;
      }
    });
  }

  setOpenMenu(menus: NzSafeAny, id?: NzSafeAny) {
    const getNodes = (result, object) => {
      object.open = false;
      this.openMenuMap[object.menuId] = false;
      if (id) {
        if (object.menuId === id) {
          const objectResult = Object.assign({}, object);
          result.push(objectResult);
          objectResult.open = true;
          this.openMenuMap[object.menuId] = true;
          return result;
        }
      } else {
        if (this.currentUrl !== '/' && object.menuUri === this.currentUrl) {
          const objectResult = Object.assign({}, object);
          result.push(objectResult);
          objectResult.open = true;
          this.openMenuMap[object.menuId] = true;
          return result;
        }
      }
      if (Array.isArray(object.subs)) {
        const subs = object.subs.reduce(getNodes, []);
        if (subs.length) {
          object.open = false;
          this.openMenuMap[object.menuId] = false;
          for (let i = 0; i < subs.length; i++) {
            if (subs[i].open) {
              object.open = true;
              this.openMenuMap[object.menuId] = true;
              break;
            }
          }
          result.push({ ...object, subs });
        } else {
          object.open = false;
          this.openMenuMap[object.menuId] = false;
          result.push({ ...object });
        }
      } else {
        object.open = false;
        this.openMenuMap[object.menuId] = false;
        result.push({ ...object });
      }
      return result;
    };
    this.menus = menus.reduce(getNodes, []);
  }

  buildBreadCrumb(currentRouter: string): IBreadCrumb[] {
    currentRouter = currentRouter.toLowerCase();
    let menu: AppFunction = this.session.getSessionData(currentRouter);
    if (!menu) {
      menu = this.session.getSessionData(currentRouter.split('?')[0]);
      if (!menu) {
        menu = this.session.getSessionData(currentRouter.substring(0, currentRouter.lastIndexOf('/')));
      }
    }
    this.pageName = menu?.menuName ?? '';
    return menu?.breadCrumbs ?? [];
  }

  getActiveRouteData() {
    this.subs.push(
      this.route.events
        .pipe(
          filter((event) => event instanceof NavigationEnd),
          map(() => {
            let child = this.activeRoute.firstChild;
            while (child) {
              if (child.firstChild) {
                child = child.firstChild;
              } else if (child.snapshot.data) {
                return child.snapshot.data;
              } else {
                return null;
              }
            }
            return null;
          })
        )
        .subscribe((data: NzSafeAny) => {
          this.activeRouteData = data;
        })
    );
  }

  searchMenu($event: string, data: NzSafeAny = this.menus) {
    this.filter($event, this.menusOrigin);
  }

  filter(text, array: AppFunction[]) {
    const getNodes = (result: AppFunction[], object: AppFunction) => {
      if (!text) {
        this.openMenuMap[object.menuId] = false;
        result.push(object);
        return result;
      } else {
        if (!object.menuName) {
          object.menuName = '';
        }
        const index = object.menuName.toLowerCase().indexOf(text.toLowerCase());
        if (index !== -1) {
          const objectResult = Object.assign({}, object);
          objectResult.menuName =
            objectResult.menuName.substring(0, index) +
            '<span class=\'text__search--highlight\'>' +
            objectResult.menuName.substring(index, index + text.length) +
            '</span>' +
            objectResult.menuName.substring(index + text.length);
          result.push(objectResult);
          this.openMenuMap[object.menuId] = true;
          // this.setHighlight(object.subs, text);
          return result;
        }
        if (Array.isArray(object.subs)) {
          const subs = object.subs.reduce(getNodes, []);
          if (subs.length) {
            result.push({ ...object, subs });
            this.openMenuMap[object.menuId] = true;
          } else {
            this.openMenuMap[object.menuId] = false;
          }
        } else {
          this.openMenuMap[object.menuId] = false;
        }
        return result;
      }
    };
    this.menus = array.reduce(getNodes, []);
  }

  setClassSelected(id) {
    this.selectedMenuId = id;
  }

  mouseenter() {
    if (!this.deviceMobileNotByWidth) {
      this.setOpenMenu(this.menus);
      this.isCollapsed = false;
    }
  }

  mouseLeave() {
    if (!this.deviceMobileNotByWidth) {
      if (!this.isCollapsed && !this.isPinMenu) {
        this.setOpenMenu(this.menus);
        this.isCollapsed = true;
      }
    }
  }

  touchEnter() {
    if (!this.isMobile && this.deviceMobileNotByWidth && this.firstClick) {
      this.firstClick = false;
      this.isCollapsed = false;
      this.setOpenMenu(this.menus);
    }
  }

  touchLeave() {
    if (!this.isMobile && this.deviceMobileNotByWidth && !this.firstClick) {
      this.firstClick = true;
      this.isCollapsed = true;
      this.setOpenMenu(this.menus);
    }
  }

  onPinClick() {
    const hiddenDiv = this.el.nativeElement.querySelectorAll('.hidden__div');
    const nzSider = this.el.nativeElement.querySelectorAll('nz-sider.sidebar__primary--no-mobile');
    if (this.isPinMenu) {
      this.isPinMenu = false;
      hiddenDiv[0].style.display = 'block';
      nzSider[0].style.position = 'absolute';
    } else {
      this.isPinMenu = true;
      this.isCollapsed = false;
      hiddenDiv[0].style.display = 'none';
      nzSider[0].style.position = 'unset';
    }
  }

  translates(label: string): string {
    return this.translate.instant(CommonUtils.isNullOrEmpty(label) ? ' ' : label);
  }

  trackByFn(index, item: AppFunction) {
    return item.menuId;
  }

  onBackClick() {
    StorageService.set('redirectByBackBtn', 'true');
    history.back();
  }

  open(menu, event: MouseEvent) {
    if (menu.menuUri?.includes('https') || menu.menuUri?.includes('http') || event.ctrlKey) {
      if (event.ctrlKey) {
        window.open(window.location.origin + menu.menuUri);
      } else {
        window.open(menu.menuUri);
      }
    } else {
      this.route.navigateByUrl(menu.menuUri);
    }
  }

  openModal() {
    this.currentUrl = this.router.url;
    this.configPageService.getList({ url: this.currentUrl }, UrlConstant.CONFIG_PAGE.CONFIG_URL).subscribe(res => {
      if (res.code === HTTP_STATUS_CODE.SUCCESS) {
        if (res.data?.reportConfigs?.length > 0 || res.data?.configObjectAttributes?.length > 0 || res.data?.configParameters?.length > 0) {
          this.listFile = res.data;
          this.openViewModal(this.listFile);
          // this.isVisible = true;
        }
      }
    });
  }

  openViewModal(data: any) {
    this.formConfig = {
      title: 'common.button.configPage',
      content: ConfigComponent
    };
    const mode = this.modeConst.EDIT;
    this.modalRef = this.modal.create({
      nzWidth: '60%',
      nzTitle: this.translate.instant(this.formConfig.title),
      nzContent: this.formConfig.content,
      nzMaskClosable: this.formConfig.isCloseModal,
      nzComponentParams: {
        mode,
        data,
        config: this.formConfig.config
      },
      nzFooter: this.footerTpl
    });
  }

  // openModalEdit(fileData: NzSafeAny) {
  //   this.isVisibleEdit = true;
  //   this.fileData = fileData;
  //   this.fileListData = fileData?.attachmentFileList?.map(item => {
  //     return {
  //       uid: item.attachmentId,
  //       name: item.fileName,
  //       checkSum: item.checkSum,
  //       status: 'done'
  //     };
  //   });
  // }

  // downloadFile(file: NzUploadFile) {
  //   if (file) {
  //     const url = this.url.replace('{attachmentId}', file.attachmentId).replace('{checksum}', file.checkSum);
  //     this.fileService.doDownloadAttachFileWithSecurity(url, null, MICRO_SERVICE.ADMIN).pipe().subscribe();
  //   }
  // }

  // handleOk() {
  //   this.dynamicReportService.update({
  //     files: this.fileListData,
  //     id: this.fileData?.dynamicReportId,
  //     data: { attachmentDeleteIds: this.attachmentDeleteIds }
  //   }, REQUEST_TYPE.FORM_DATA_FILE, UrlConstant.DYNAMIC_REPORTS.FILE)
  //     .subscribe(res => {
  //       if (res.code === HTTP_STATUS_CODE.SUCCESS) {
  //         this.toast.success(
  //           this.translate.instant('common.notification.updateSuccess')
  //         );
  //         this.openModal();
  //         this.handleCancelEdit();
  //       }
  //     });
  // }
  //
  // removeFileChild(ids: number[]) {
  //   this.attachmentDeleteIds = ids;
  // }
  //
  // changeFile(listFile: NzUploadFile[], isMultiple?: boolean) {
  //   this.fileListData = isMultiple ? listFile : listFile[0];
  // }

  handleCancel(): void {
    this.isVisible = false;
  }

  handleCancelEdit(): void {
    this.isVisibleEdit = false;
  }

  ngOnDestroy(): void {
    this.subs?.forEach(sub => sub?.unsubscribe());
  }

  getTypeIcon(icon: string): string {
    if (!icon) return '';
    if (icon.indexOf('fas ') === 0 || icon.indexOf('far ') === 0) {
      return 'AWESOME';
    } else if (icon.indexOf('/assets') === 0) {
      return 'IMAGE';
    } else {
      return 'ZORRO';
    }
  }
}

