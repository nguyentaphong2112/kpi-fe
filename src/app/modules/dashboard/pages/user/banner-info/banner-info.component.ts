import {Component, OnInit, ViewChild} from '@angular/core';
// import {SwiperComponent} from "swiper/angular";
// import SwiperCore, { Autoplay, Navigation, Virtual } from 'swiper';

// SwiperCore.use([
//   Autoplay,
//   Navigation,
//   Virtual
// ]);

@Component({
  selector: 'app-banner-info',
  templateUrl: './banner-info.component.html',
  styleUrls: ['./banner-info.component.scss']
})
export class BannerInfoComponent implements OnInit {
  // @ViewChild('swiperComponent') swiper: SwiperComponent;
  activeIndex = 0;
  data = [
    {
      url: "./assets/img/banner2.png"
    }
  ];

  constructor() {
  }

  ngOnInit(): void {
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

}
