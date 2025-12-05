import {Component, HostListener, OnInit, ViewChild} from '@angular/core';
// import {SwiperComponent} from "swiper/angular";
import {NzModalRef} from "ng-zorro-antd/modal";

@Component({
  selector: 'app-application-info',
  templateUrl: './application-info.component.html',
  styleUrls: ['./application-info.component.scss']
})
export class ApplicationInfoComponent implements OnInit {

  // @ViewChild('swiperComponent') swiper: SwiperComponent;
  activeIndex = 0;
  slidesPerView = 6;
  wSpace = 0;
  offsetWidth = 480;
  currentWidth = window.innerWidth;
  apps = [
    { url: '#', title: 'Mẫu biểu', iconPath: '/assets/img/icon_card/mau_bieu.png', disabled: false, openNewTab: false },
    { url: '#', title: 'Đăng ký nghỉ', iconPath: '/assets/img/icon_card/nghi.png', disabled: false, openNewTab: false },
    { url: '#', title: 'Đào tạo', iconPath: '/assets/img/icon_card/dao_tao.png', disabled: false, openNewTab: false },
    { url: '#', title: 'Tuyển dụng', iconPath: '/assets/img/icon_card/tuyen_dung.png', disabled: false, openNewTab: false },
    { url: '#', title: 'Giảm trừ gia cảnh', iconPath: '/assets/img/icon_card/giam_tru.png', disabled: false, openNewTab: false },
    { url: '#', title: 'Todo list', iconPath: '/assets/img/icon_card/todo.png', disabled: false, openNewTab: false }
  ];

  modal: NzModalRef;

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


  constructor() {
    if (this.currentWidth > 992) {
      this.offsetWidth = this.currentWidth - 160 - 450;
    } else {
      this.offsetWidth = this.currentWidth - 48;
    }
  }

  ngOnInit(): void {
    this.wSpace = (this.offsetWidth - this.slidesPerView * 198) / (this.slidesPerView - 1);
    this.resizeConfig();
  }

  // swipeNext() {
  //   this.swiper.swiperRef.slideNext();
  // }
  //
  // swipePrev() {
  //   this.swiper.swiperRef.slidePrev();
  // }
  //
  // slideChangeEvent() {
  //   this.activeIndex = this.swiper.swiperRef.activeIndex;
  // }

  @HostListener('window:resize', ['$event'])
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
      this.wSpace = (this.offsetWidth - 2 * 129);
    }
  }

}
