import { Component, EventEmitter, Injector, OnInit } from '@angular/core';
import { CommonUtils } from '@shared/services/common-utils.service';
import { BaseComponent } from '@core/components/base.component';
import { UserLogin } from '@shared/model/user-login';
import { StorageService } from '@core/services/storage.service';
import { STORAGE_NAME } from '@core/constant/system.constants';
import Shud from '@app/modules/crm/pages/pytago-managers/pytago/pto-index/shud';
import { PytagoResearchsService } from '@app/modules/crm/data-access/services/pytago-managers/pytago-researchs.service';
import { REQUEST_TYPE } from '@shared/constant/common';
import { ShudService } from '@app/modules/crm/data-access/services/pytago-managers/shud.service';
import { AuthService } from '@shared/services/auth.service';
import { PtoLoginFormComponent } from '@app/modules/crm/pages/pytago-managers/pytago/pto-login-form/pto-login-form.component';
import { format } from 'date-fns';
import { environment } from '@env/environment';
import { catchError } from 'rxjs/operators';
import { Subject, throwError } from 'rxjs';

@Component({
  selector: 'app-pto-index',
  templateUrl: './pto-index.component.html',
  styleUrls: ['./pto-index.component.scss']
})
export class PtoIndexComponent extends BaseComponent implements OnInit {
  userLogin: UserLogin = new UserLogin();
  currentYear = new Date().getFullYear();

  constructor(private shudService: ShudService,
              private pytagoResearchsService: PytagoResearchsService,
              private authService: AuthService,
              injector: Injector) {
    super(injector);
    this.updateData();
  }

  state: any = {
    shudData: {},
    user: {
      person_type: 'NGUOI_LON',
      name: '',
      birthday: '',
      parent_name: '',
      mobile: '',
      email: '',
      address: '',
    },
    shud: {
      fullname: '',
      birthday: '',
      age: '',
      age_with_year: '',
      email: '',
      mobile: '',
      parent_fullname: '',
      parent_birthday: '',
      HK_bieu_do_ho_ten: '',
      soDuongDoi: '',
      soNgaySinh: '',
      suMenh: '',
      tuongTac: '',
      dinh1: '',
      dinh2: '',
      dinh3: '',
      dinh4: '',
      dinhcao1: '',
      dinhcao2: '',
      dinhcao3: '',
      dinhcao4: '',
      HK_tuoi_dinh_1: '',
      HK_tuoi_dinh_2: '',
      HK_tuoi_dinh_3: '',
      HK_tuoi_dinh_4: '',
      HK_4_dinh_cao_cuoc_doi: '',
      HK_nam_ca_nhan: '',
      HK_thai_do: '',
      HK_bieu_do_ngay_sinh: '',
      HK_noi_tam: '',
      HK_so_lap: [],
      HK_ket_noi_duong_doi_va_su_menh: '',
      HK_truong_thanh: '',
      HK_can_bang: '',
      HK_bo_sung: [],
      HK_ket_noi_noi_tam_va_tuong_tac: '',
      HK_noi_cam: [],
      HK_trai_nghiem: '',
      HK_truc_giac: '',
      HK_cam_xuc: '',
      HK_logic: '',
      HK_thach_thuc: [],
    },
    linedate: {
      date369: false,
      date258: false,
      date147: false,
      date123: false,
      date456: false,
      date789: false,
      date159: false,
      date357: false,
    },
    linename: {
      name369: false,
      name258: false,
      name147: false,
      name123: false,
      name456: false,
      name789: false,
      name159: false,
      name357: false,
    },
    triangle: {
      top1: { age: '', age_top: '', year: '' },
      top2: { age: '', age_top: '', year: '' },
      top3: { age: '', age_top: '', year: '' },
      top4: { age: '', age_top: '', year: '' },
    }
  };
  linedateSample = {
    date369: false,
    date258: false,
    date147: false,
    date123: false,
    date456: false,
    date789: false,
    date159: false,
    date357: false,
  };
  linenameSample = {
    name369: false,
    name258: false,
    name147: false,
    name123: false,
    name456: false,
    name789: false,
    name159: false,
    name357: false,
  };
  videoExplain = [
    { name: 'Biểu đồ mũi tên', url: 'https://youtube.com/playlist?list=PLYQIA74HhMh6v9_8nnrHi3xtskdI2gceY' },
    { name: 'Sứ mệnh', url: 'https://youtube.com/playlist?list=PLYQIA74HhMh6-gEA7k5ju7HGlOsNMi8UL' },
    { name: 'Đường đời', url: 'https://youtube.com/playlist?list=PLYQIA74HhMh48iSw82VHmYUjBZW-p10HD' },
    { name: 'Đỉnh cao I, II, III, IV', url: 'https://youtube.com/playlist?list=PLYQIA74HhMh5KA2rQkIOLUfMyGyGm1Fhj' },
    { name: 'Năm cá nhân', url: 'https://youtube.com/playlist?list=PLYQIA74HhMh5Yxh3AfguP1nrNJKI0RgrQ' },
    { name: 'Nội tâm', url: 'https://youtube.com/playlist?list=PLYQIA74HhMh42iYh_sGTZUyErh7LXdYym' },
    { name: 'Tương tác', url: 'https://youtube.com/playlist?list=PLYQIA74HhMh5YfFiZlL4Sq8PiS_N0ErKm' },
    { name: 'Thái độ', url: 'https://youtube.com/playlist?list=PLYQIA74HhMh7Hf-dDE9K6cNQjAZzVnlE4' },
    { name: 'Ngày sinh', url: 'https://www.youtube.com/playlist?list=PLYQIA74HhMh6ZXxg-kqIra_86EN1OchkL' }
  ];
  isSearching = false;
  isAdmin = false;
  disableExport = true;

  async updateData() {
    this.userLogin = StorageService.get(STORAGE_NAME.USER_LOGIN);
    if (this.userLogin) {
      this.isAdmin = this.userLogin?.loginName === 'admin';
      this.state.shudData = await this.getCount();
    }
  }

  ngOnInit(): void {
  }

  async onFinish(dataInput: any) {
    this.isSearching = true;
    if (!dataInput.name || !dataInput.birthday) {
      this.toast.error('Vui lòng nhập đầy đủ thông tin!');
      return;
    } else {
      let isShowFull = false;
      if (this.userLogin) {
        if (!this.isAdmin &&
          (!dataInput.email || !dataInput.mobile ||
            (dataInput.person_type === 'TRE_EM' && !dataInput.parent_name))
        ) {
          this.toast.error('Vui lòng nhập đầy đủ thông tin!');
          this.isSearching = false;
          return;
        } else {
          isShowFull = true;
        }
      } else {
        if (!dataInput.email || !dataInput.mobile || (dataInput.person_type === 'TRE_EM' && !dataInput.parent_name)) {
          this.toast.error('Vui lòng nhập đầy đủ thông tin!');
          this.isSearching = false;
          return;
        }
      }
      this.updateData();
      const data: any = {};
      if (this.userLogin) {
        this.state.shudData = await this.getCount();
        if ((this.state.shudData?.totalSearch - this.state.shudData?.totalSearched) > 0) {
          isShowFull = true;
        }
        const exportRemaining = this.state.shudData?.totalExport - this.state.shudData?.totalExported;
        if (this.isAdmin || exportRemaining > 0) {
          this.disableExport = false;
        }
      } else {
        // message.error({content: () => 'Phiên đăng nhập hết hạn', class: 'message-popup', duration: 1.5});
        isShowFull = false;
        this.disableExport = true;
      }
      this.state.linedate = this.linedateSample;
      this.state.linename = this.linenameSample;
      data.email = dataInput?.email ?? '';
      data.mobile = dataInput?.mobile ?? '';
      data.address = dataInput?.address ?? '';
      data.person_type = dataInput?.person_type ?? 'TRE_EM';
      if (dataInput?.person_type === 'TRE_EM') {
        data.parent_name = dataInput?.parent_name ?? '';
      }
      data.name = dataInput?.name ?? '';
      let birthday = '';
      birthday = format(dataInput?.birthday, 'dd/MM/yyyy') ?? '';
      const tmpDay = birthday.split('/');
      data.birthday = birthday ?? '';
      data.date = parseInt(tmpDay[0]) ?? 0;
      data.month = parseInt(tmpDay[1]) ?? 0;
      data.year = parseInt(tmpDay[2]) ?? 0;

      for (let key in this.state.shud) {
        if (this.state.shud.hasOwnProperty(key)) {
          if (this.state.shud[key] instanceof Array) {
            this.state.shud[key] = [];
          } else {
            this.state.shud[key] = '';
          }
        }
      }
      this.state.shud = { ...this.state.shud, ...Shud.calculate(data, this.userLogin?.loginName ?? '', isShowFull) };
      this.state.shud.age_with_year = this.state.shud.age ? this.state.shud.age + ' (' + this.currentYear + ')' : '';
      this.state.shud.HK_nam_ca_nhan = this.state.shud.HK_nam_ca_nhan ? this.state.shud.HK_nam_ca_nhan + ' (' + this.currentYear + ')' : '';
      this.state.shud.dinhcao1 = this.state.shud.dinh1 ? this.state.shud.dinh1 + ' (' + this.state.shud.HK_tuoi_dinh_1 + ' tuổi)' : '';
      this.state.shud.dinhcao2 = this.state.shud.dinh2 ? this.state.shud.dinh2 + ' (' + this.state.shud.HK_tuoi_dinh_2 + ' tuổi)' : '';
      this.state.shud.dinhcao3 = this.state.shud.dinh3 ? this.state.shud.dinh3 + ' (' + this.state.shud.HK_tuoi_dinh_3 + ' tuổi)' : '';
      this.state.shud.dinhcao4 = this.state.shud.dinh4 ? this.state.shud.dinh4 + ' (' + this.state.shud.HK_tuoi_dinh_4 + ' tuổi)' : '';
      // --- BIEU DO NGAY SINH ---
      this.state.linedate.date369 = false;
      if (this.state.shud.HK_bieu_do_ngay_sinh[3] && this.state.shud.HK_bieu_do_ngay_sinh[6] && this.state.shud.HK_bieu_do_ngay_sinh[9]) {
        this.state.linedate.date369 = true;
      }
      this.state.linedate.date258 = false;
      if (this.state.shud.HK_bieu_do_ngay_sinh[2] && this.state.shud.HK_bieu_do_ngay_sinh[5] && this.state.shud.HK_bieu_do_ngay_sinh[8]) {
        this.state.linedate.date258 = true;
      }
      this.state.linedate.date147 = false;
      if (this.state.shud.HK_bieu_do_ngay_sinh[1] && this.state.shud.HK_bieu_do_ngay_sinh[4] && this.state.shud.HK_bieu_do_ngay_sinh[7]) {
        this.state.linedate.date147 = true;
      }
      this.state.linedate.date357 = false;
      if (this.state.shud.HK_bieu_do_ngay_sinh[3] && this.state.shud.HK_bieu_do_ngay_sinh[5] && this.state.shud.HK_bieu_do_ngay_sinh[7]) {
        this.state.linedate.date357 = true;
      }
      this.state.linedate.date159 = false;
      if (this.state.shud.HK_bieu_do_ngay_sinh[1] && this.state.shud.HK_bieu_do_ngay_sinh[5] && this.state.shud.HK_bieu_do_ngay_sinh[9]) {
        this.state.linedate.date159 = true;
      }
      this.state.linedate.date123 = false;
      if (this.state.shud.HK_bieu_do_ngay_sinh[1] && this.state.shud.HK_bieu_do_ngay_sinh[2] && this.state.shud.HK_bieu_do_ngay_sinh[3]) {
        this.state.linedate.date123 = true;
      }
      this.state.linedate.date456 = false;
      if (this.state.shud.HK_bieu_do_ngay_sinh[4] && this.state.shud.HK_bieu_do_ngay_sinh[5] && this.state.shud.HK_bieu_do_ngay_sinh[6]) {
        this.state.linedate.date456 = true;
      }
      this.state.linedate.date789 = false;
      if (this.state.shud.HK_bieu_do_ngay_sinh[7] && this.state.shud.HK_bieu_do_ngay_sinh[8] && this.state.shud.HK_bieu_do_ngay_sinh[9]) {
        this.state.linedate.date789 = true;
      }
      // --- BIEU DO HO TEN ---
      this.state.linename.name369 = false;
      if (this.state.shud.HK_bieu_do_ho_ten[3] && this.state.shud.HK_bieu_do_ho_ten[6] && this.state.shud.HK_bieu_do_ho_ten[9]) {
        this.state.linename.name369 = true;
      }
      this.state.linename.name258 = false;
      if (this.state.shud.HK_bieu_do_ho_ten[2] && this.state.shud.HK_bieu_do_ho_ten[5] && this.state.shud.HK_bieu_do_ho_ten[8]) {
        this.state.linename.name258 = true;
      }
      this.state.linename.name147 = false;
      if (this.state.shud.HK_bieu_do_ho_ten[1] && this.state.shud.HK_bieu_do_ho_ten[4] && this.state.shud.HK_bieu_do_ho_ten[7]) {
        this.state.linename.name147 = true;
      }
      this.state.linename.name357 = false;
      if (this.state.shud.HK_bieu_do_ho_ten[3] && this.state.shud.HK_bieu_do_ho_ten[5] && this.state.shud.HK_bieu_do_ho_ten[7]) {
        this.state.linename.name357 = true;
      }
      this.state.linename.name159 = false;
      if (this.state.shud.HK_bieu_do_ho_ten[1] && this.state.shud.HK_bieu_do_ho_ten[5] && this.state.shud.HK_bieu_do_ho_ten[9]) {
        this.state.linename.name159 = true;
      }
      this.state.linename.name123 = false;
      if (this.state.shud.HK_bieu_do_ho_ten[1] && this.state.shud.HK_bieu_do_ho_ten[2] && this.state.shud.HK_bieu_do_ho_ten[3]) {
        this.state.linename.name123 = true;
      }
      this.state.linename.name456 = false;
      if (this.state.shud.HK_bieu_do_ho_ten[4] && this.state.shud.HK_bieu_do_ho_ten[5] && this.state.shud.HK_bieu_do_ho_ten[6]) {
        this.state.linename.name456 = true;
      }
      this.state.linename.name789 = false;
      if (this.state.shud.HK_bieu_do_ho_ten[7] && this.state.shud.HK_bieu_do_ho_ten[8] && this.state.shud.HK_bieu_do_ho_ten[9]) {
        this.state.linename.name789 = true;
      }
      // --- TRIANGLE ---
      const explodeDmy = this.state.shud.birthday.split('/');
      const yearBirthday = explodeDmy[2] ?? 0;
      this.state.triangle.top1.age = this.state.shud.HK_tuoi_dinh_1 ?? (this.state.shud.HK_tuoi_dinh_1 + 't');
      this.state.triangle.top1.age_top = this.state.shud.dinh1;
      const year1 = parseInt(this.state.shud.HK_tuoi_dinh_1) + parseInt(yearBirthday);
      this.state.triangle.top1.year = year1 ? '(' + year1 + ')' : '';
      this.state.triangle.top2.age = this.state.shud.HK_tuoi_dinh_2 ?? (this.state.shud.HK_tuoi_dinh_2 + 't');
      this.state.triangle.top2.age_top = this.state.shud.dinh2;
      const year2 = parseInt(this.state.shud.HK_tuoi_dinh_2) + parseInt(yearBirthday);
      this.state.triangle.top2.year = year2 ? '(' + year2 + ')' : '';
      this.state.triangle.top3.age = this.state.shud.HK_tuoi_dinh_3 ?? (this.state.shud.HK_tuoi_dinh_3 + 't');
      this.state.triangle.top3.age_top = this.state.shud.dinh3;
      const year3 = parseInt(this.state.shud.HK_tuoi_dinh_3) + parseInt(yearBirthday);
      this.state.triangle.top3.year = year3 ? '(' + year3 + ')' : '';
      this.state.triangle.top4.age = this.state.shud.HK_tuoi_dinh_4 ?? (this.state.shud.HK_tuoi_dinh_4 + 't');
      this.state.triangle.top4.age_top = this.state.shud.dinh4;
      const year4 = parseInt(this.state.shud.HK_tuoi_dinh_4) + parseInt(yearBirthday);
      this.state.triangle.top4.year = year4 ? '(' + year4 + ')' : '';
      this.shudUpdateData(data);
      // canUseShud();
    }
    this.isSearching = false;
  }

  private shudUpdateData(data: any) {
    const dataSend = {
      currentAddress: data.address,
      dateOfBirth: data.birthday,
      email: data.email,
      fullName: data.name,
      mobileNumber: data.mobile,
      parentName: data.parent_name,
      type: data.person_type,
    };
    this.pytagoResearchsService.createOrImport(CommonUtils.convertDataSendToServer(dataSend), REQUEST_TYPE.DEFAULT).toPromise();
  }

  async getCount() {
    const res = await this.pytagoResearchsService.getList({}, '/count', false).pipe(catchError(err => {
      this.onLogout();
      return throwError(err);
    })).toPromise();
    return res.data;
  }

  printBook() {
    this.shudService.export(this.state.shud, '/export-adult', true, { isNotAutoPreview: true }, 'json').subscribe(res => {
      this.download(res.data);
      this.state.shudData.totalExported += 1;
      this.disableExport = true;
    });
  }

  download(file: string) {
    const url = `${environment.frontend}crm-download/${file}`;
    const a = document.createElement('a');
    a.href = url;
    a.download = file;  // Đặt tên file mà người dùng sẽ tải xuống
    a.click();

    // Hủy URL tạm thời để giải phóng bộ nhớ
    window.URL.revokeObjectURL(url);
  }

  openFormLogin() {
    const modalRef = this.modal.create({
      nzContent: PtoLoginFormComponent,
      nzMaskClosable: false,
      nzFooter: null
    });
    modalRef.afterClose.subscribe(res => {
      if (res) {
        this.updateData();
      }
    });
  }

  onLogout() {
    this.authService.logout(true);
    this.updateData();
  }
}

interface IShud {
  personType: string;
  name: string;
  birthday: string;
  parentName: string;
  mobile: string;
  email: string;
  address: string;
  uid: string;
  date: number;
  month: number;
  year: number;
}
