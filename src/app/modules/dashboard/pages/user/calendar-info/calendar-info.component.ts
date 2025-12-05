import {AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import { format, parse } from 'date-fns';

@Component({
  selector: 'app-calendar-info',
  templateUrl: './calendar-info.component.html',
  styleUrls: ['./calendar-info.component.scss']
})
export class CalendarInfoComponent implements OnInit, AfterViewInit {
  date: any;
  listSelectedDate = [
    {date:'11/09/2022', type: 2, borderColor: '#66CAFF', backgroundColor: 'transparent', title: 'Vắng cả ngày'},
    {date:'21/09/2022', type: 2, borderColor: '#66CAFF', backgroundColor: 'transparent', title: 'Vắng cả ngày'},
    {date:'12/09/2022', type: 3, borderColor: '#7F85F3', backgroundColor: 'transparent', title: 'Vắng nửa buổi'},
    {date:'27/09/2022', type: 3, borderColor: '#7F85F3', backgroundColor: 'transparent', title: 'Vắng nửa buổi'},
    {date:'01/09/2022', type: 1, borderColor: '#141ED2', backgroundColor: '#141ED2', title: 'Hôm nay'},
  ];

  listType = [];
  listNoteType = [];

  @ViewChild("elementCalBox") elementCalBox: ElementRef;
  @ViewChild("elementCusMonth") elementCusMonth: ElementRef;
  calValue: any;
  $window = window;

  constructor(
    private renderer: Renderer2,
  ) { }

  ngOnInit(): void {
    this.listSelectedDate.forEach(item => {
      if (this.listType.indexOf(item.type) == -1) {
        this.listType.push(item.type);
        this.listNoteType.push(item);
      }
    });
  }

  ngAfterViewInit() {
    this.changeDataContent();
    let elementsHeader = this.elementCalBox.nativeElement.querySelector('.ant-picker-header');
    let elementsPicker = this.elementCalBox.nativeElement.querySelectorAll('.ant-picker-cell');
    let elementsButton = elementsHeader.querySelectorAll('button');
    elementsButton.forEach(item => {
      this.renderer.listen(item, 'click', () => {
        this.changeDataContent();
      });
    });
    elementsPicker.forEach(item => {
      this.renderer.listen(item, 'click', () => {
        this.changeDataContent();
      });
    });
  }

  changeDataContent() {
    let elementsHeader = this.elementCalBox.nativeElement.querySelector('.ant-picker-header');
    let elementsMonth = elementsHeader.querySelector('.ant-picker-header-month-btn');
    let dateInner = parse(elementsMonth.textContent?.trim(), 'MM/yyyy', new Date());
    this.calValue = format(dateInner, 'MM/yyyy');
    this.elementCusMonth.nativeElement.innerHTML = this.calValue;
  }

  getStyle(current: any): string {
    let style: string = '';
    let textColor = '#000';
    let dateStr = format(current, 'dd/MM/yyyy');
    this.listSelectedDate.forEach(item => {
      if (item.date == dateStr) {
        if (item.backgroundColor != 'transparent')
          textColor = '#fff';
        style = `border: 1px solid ${item.borderColor}!important; background:${item.backgroundColor}; color:${textColor}`;
      }
    });
    return style;
  }
}
