import {Component, OnInit} from '@angular/core';
import { SessionService } from '@core/services/session.service';

@Component({
  selector: 'app-general-info',
  templateUrl: './general-info.component.html',
  styleUrls: ['./general-info.component.scss']
})
export class GeneralInfoComponent implements OnInit {

  isShowSlide = false;
  listSlide = [];

  code = null;
  name = '';

  array = [
    {
      url: "./assets/img/baner.jpg"
    },
    {
      url: "./assets/img/baner2.png"
    },
  ];

  constructor(private sessionService: SessionService) {
    if(this.sessionService.getSessionData(`FUNCTION_HOME_TCCB`)){
      this.listSlide.push({"code":'TCCB', name: 'Tổ chức cán bộ'});
    }
    if(this.sessionService.getSessionData(`FUNCTION_HOME_CBNV`)){
      this.listSlide.push({"code":'CBNV', name: 'Nhân viên'});
    }
    if(this.listSlide.length > 0){
      this.code = this.listSlide[0].code;
    }
    this.isShowSlide = this.listSlide.length > 1;
  }

  ngOnInit(): void {
    this.change(0);
  }

  change(value: number) {
    const index = this.listSlide.findIndex(el => el.code === this.code);
    const slide = this.listSlide[index + value];
    if (slide) {
      this.setValue(slide);
    } else {
      if (index === this.listSlide.length - 1) {
        this.setValue(this.listSlide[0]);
      }
      if (index === 0) {
        this.setValue(this.listSlide[this.listSlide.length - 1]);
      }
    }
  }

  setValue(slide: any) {
    this.code = slide?.code;
    this.name = slide?.name;
  }
}
