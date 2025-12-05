import { AfterContentInit, AfterViewInit, Directive, ElementRef, HostListener, Inject, Renderer2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Directive({
  selector: '[scrollSpy]'
})
export class ScrollSpyDirective implements AfterContentInit, AfterViewInit {

  constructor(@Inject(DOCUMENT) private document: any,
              private el: ElementRef,
              private renderer: Renderer2) {
  }

  private elements = [];
  private currentActiveLink;
  private directNavigation = false;

  private static getId(elem) {
    const id = elem.id;
    if (!id) {
      return null;
    }
    return id.replace('#', '');
  }

  public ngAfterContentInit(): void {
    this.collectIds();
  }

  public collectIds() {
    this.elements = [];
    const elements = this.el.nativeElement.querySelectorAll('li');
    for (let i = 0; i < elements.length; i++) {
      const elem = elements.item(i);
      const id = ScrollSpyDirective.getId(elem);
      if (!id) {
        continue;
      }
      const destination = this._getPeerElement(id);
      if (!destination) {
        continue;
      }
      this.elements.push({
        id,
        link: elem,
        destination
      });
    }
  }

  private _getPeerElement(id) {
    const destination = this.document.getElementById(id);
    if (!destination) {
      return null;
    }
    return destination;
  }

  @HostListener('scroll', ['$event'])
  onScroll() {
    if (this.directNavigation) {
      return;
    }
    for (let i = 0; i < this.elements.length; i++) {
      const top = this.elements[i].destination.offsetTop;
      const bottom = i !== (this.elements.length - 1) ? this.elements[i + 1].destination.offsetTop : (top + this.elements[i].destination.offsetHeight);
      if (this.el.nativeElement.scrollTop >= top && this.el.nativeElement.scrollTop <= bottom) {
        this._cleanCurrentLink();
        this._setCurrentLink(this.elements[i].link);
      } else {
        this.renderer.removeClass(this.elements[i].link, 'ant-menu-item-selected');
      }
    }
  }

  private _cleanCurrentLink() {
    if (!this.currentActiveLink) {
      return;
    }
    this.renderer.removeClass(this.currentActiveLink, 'ant-menu-item-selected');
  }

  private _setCurrentLink(elem) {
    this.currentActiveLink = elem;
    this.renderer.addClass(this.currentActiveLink, 'ant-menu-item-selected');
  }

  public setLink(index: number) {
    this.currentActiveLink = this.elements[index].link;
    this.renderer.addClass(this.currentActiveLink, 'ant-menu-item-selected');
  }

  ngAfterViewInit(): void {
    this.collectIds();
  }
}
