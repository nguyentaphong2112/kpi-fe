import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-menu-search',
  templateUrl: './menu-search.component.html',
  styleUrls: ['./menu-search.component.scss']
})
export class MenuSearchComponent implements OnInit {
  @Input() isCollapsed = true;
  @Output() onBlurEvent: EventEmitter<any> = new EventEmitter<any>();
  value: any;

  constructor() {
  }

  ngOnInit(): void {
  }

  clearResult() {
    this.value = '';
    this.onBlurEvent.emit(this.value);
  }

  onBlur() {
    this.onBlurEvent.emit(this.value);
  }
}
