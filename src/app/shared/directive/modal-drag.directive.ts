import { Directive, ElementRef, HostListener, AfterViewInit } from '@angular/core';

@Directive({
  selector: '[modalDraggable]',
})
export class modalDraggableDirective implements AfterViewInit {
  private modalElement: HTMLElement;
  private topStart: number;
  private leftStart: number;
  private isDraggable: boolean;
  private handleElement: HTMLElement;

  constructor(public element: ElementRef) {
  }

  ngAfterViewInit() {
    let element = this.element.nativeElement;
    // only make the modal header draggable
    this.handleElement = this.element.nativeElement;
    // change cursor on the header
    this.handleElement.style.cursor = 'all-scroll';
    // get the modal parent container element: that's the element we're going to move around
    for (let level = 2; level > 0; level--) {
      element = element.parentNode;
    }
    this.modalElement = element;
    this.modalElement.style.position = 'relative';
  }

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent) {
    if (event.button === 2 || (this.handleElement && event.target !== this.handleElement)) {
      return; // prevents right click drag
    }
    // enable dragging
    this.isDraggable = true;
    // store original position
    this.topStart = event.clientY - Number(this.modalElement.style.top.replace('px', ''));
    this.leftStart = event.clientX - Number(this.modalElement.style.left.replace('px', ''));
    event.preventDefault();
  }

  @HostListener('document:mouseup', ['$event'])
  onMouseUp(event: MouseEvent) {
    this.isDraggable = false;
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (this.isDraggable) {
      // on moving the mouse, reposition the modal
      this.modalElement.style.top = event.clientY - this.topStart + 'px';
      this.modalElement.style.left = event.clientX - this.leftStart + 'px';
    }
  }

  @HostListener('document:mouseleave', ['$event'])
  onMouseLeave(event: MouseEvent) {
    this.isDraggable = false;
  }
}
