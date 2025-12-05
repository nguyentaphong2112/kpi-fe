import { style } from '@angular/animations';
import { Directive, ElementRef, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[widthDerective]'
})
export class WidthDirective implements OnInit {
  @Input() widthCell;

  constructor(private rel: ElementRef) {
  }

  ngOnInit(): void {
    this.rel.nativeElement.style.width = this.widthCell;
  }
}