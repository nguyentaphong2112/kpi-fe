import { Component, EventEmitter, Inject, Input, LOCALE_ID, OnInit, Output } from '@angular/core';
import { HeaderEventEmit } from './header-event-emit';
import { TranslateService } from '@ngx-translate/core';
import { NzI18nService } from 'ng-zorro-antd/i18n';
import { enUS, vi } from 'date-fns/locale';
import { UserLogin } from '../../../shared/model/user-login';
import { StorageService } from '../../services/storage.service';
import { STORAGE_NAME } from '../../constant/system.constants';
import { en_US_ext } from '../../constant/nz-i18n/en_US.extra';
import { vi_VN_ext } from '../../constant/nz-i18n/vi_VN.extra';
import { PersonalInformation } from '../../models/personal-information';
import { CatalogModel } from '../../../shared/model/catalog-model';
import { AuthService } from '@shared/services/auth.service';
import { Router } from '@angular/router';
import { AppFunction } from '@core/models/app-function.interface';
import { SessionService } from '@core/services/session.service';
import { FunctionCode } from '@shared/enums/enums-constant';
import { Scopes } from '@core/utils/common-constants';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { Subscription } from 'rxjs';
import { PersonalInfoService } from '@shared/services/personal-info.service';
import { AlertModalChangeService } from '@app/modules/hrm/data-access/services/staff-info/alert-modal-change.service';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Input() isCollapsed: any;
  @Input() isMobile: any;
  @Input() searchResult: PersonalInformation[];
  @Output() headerEventEmit: EventEmitter<HeaderEventEmit> = new EventEmitter<HeaderEventEmit>();
  searchValue = null;
  objFunction: AppFunction;
  showSearch = false;
  userLogin: UserLogin = new UserLogin();
  langCurrent = 'vn';
  isHasAvatar = true;
  avtBase64: string | ArrayBuffer = '';
  statusList: CatalogModel[] = [
    {
      value: 1,
      label: 'Đang làm việc'
    },
    {
      value: 0,
      label: 'Đã nghỉ việc'
    }
  ];
  isLoadAll = false;
  empId: null;
  functionCode = FunctionCode.HR_PERSONAL_INFO;
  scope: string = Scopes.VIEW;
  subs: Subscription[] = [];
  modalRef!: NzModalRef;

  constructor(@Inject(LOCALE_ID) protected localeId: string,
              private auth: AuthService,
              private i18n: NzI18nService,
              private readonly router: Router,
              private translateService: TranslateService,
              private sessionService: SessionService,
              private alertModalChangeService: AlertModalChangeService,
              private personalInfoService: PersonalInfoService,
              private modalService: NzModalService
              ) {
  }

  ngOnInit(): void {
    this.objFunction = this.sessionService.getSessionData(`FUNCTION_${this.functionCode}`);
    this.userLogin = StorageService.get(STORAGE_NAME.USER_LOGIN);
    // this.getAvatar();
    this.onListener();
  }

  changeEmp(empId) {
    if (empId) {
      this.router.navigate(['/hrm/staff/personal-info'], { queryParams: { employeeId: empId } });
      setTimeout(() => {
        this.empId = null;
      });
    }
  }

  clickEvent() {
    this.headerEventEmit.emit(new HeaderEventEmit('TRIGGER', 'CLICK'));
  }

  showInputSearch(event: 'OPEN' | 'CLOSE') {
    if (event === 'OPEN') {
      this.showSearch = true;
    } else {
      this.showSearch = false;
      this.searchValue = null;
    }
  }

  onListener() {
    this.alertModalChangeService.saveAvatar$.subscribe((res: any) => {
      if (res) {
        this.isHasAvatar = true;
        this.avtBase64 = res;
      } else {
        this.isHasAvatar = false;
      }
    });
  }

  changeLanguage() {
    if (this.langCurrent === 'vn') {
      this.i18n.setLocale(en_US_ext);
      this.i18n.setDateLocale(enUS);
      this.translateService.use('en');
      this.langCurrent = 'en';
    } else {
      this.i18n.setLocale(vi_VN_ext);
      this.i18n.setDateLocale(vi);
      this.translateService.use('vn');
      this.langCurrent = 'vn';
    }
  }


  getAvatar(employeeId?: number | NzSafeAny) {
    this.subs.push(
      this.personalInfoService.getAvatar().subscribe(res => {
        if (!res?.data) {
          this.isHasAvatar = false;
        }
        this.avtBase64 = res?.data ? 'data:image/jpg;base64,' + res?.data : '';
      })
    );
  }

  logout() {
    this.auth.logout();
  }

  openPersonalInfo() {
    this.router.navigateByUrl('/hrm/personal/personal-info');
  }

  changeKeywordEvent() {
    this.isLoadAll = false;
    this.headerEventEmit.emit(new HeaderEventEmit('SEARCH', 'ENTER', this.searchValue));
  }

  getFlagStatus(value: number) {
    return this.statusList.find(status => status.value === value)?.label;
  }

  clickEmployees(data: PersonalInformation) {
    this.headerEventEmit.emit(new HeaderEventEmit('USER', 'ENTER', data));
  }

  viewAll() {
    this.isLoadAll = true;
  }

  openChangePassword(): void {
    this.router.navigateByUrl('/login/change-password');
  }

  protected readonly StorageService = StorageService;
  protected readonly STORAGE_NAME = STORAGE_NAME;
  protected readonly open = open;
}
