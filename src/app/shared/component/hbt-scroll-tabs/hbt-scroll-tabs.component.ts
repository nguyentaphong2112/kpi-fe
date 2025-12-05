import { Component, HostBinding, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ScrollTabOption } from './scroll-tab.config';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'hbt-scroll-tabs',
  templateUrl: './hbt-scroll-tabs.component.html',
  styleUrls: ['./hbt-scroll-tabs.component.scss', '../../../core/global-style/_scroll-tabs.scss']
})
export class HbtScrollTabsComponent implements OnInit {
  @Input() tabs: ScrollTabOption[] = [];
  @Input() count = 0;
  @Input() isShowInfoChange: boolean;
  @Input() component: TemplateRef<any>;
  @Input() isKPI = false;
  @ViewChild('footerTmpl') footerTmpl: TemplateRef<{}>;
  @HostBinding('class.scroll__tab--sticky') @Input() sticky = false;
  infoChangeModal: NzModalRef;

  constructor(
    private modalService: NzModalService,
    private translate: TranslateService
  ) {
  }

  ngOnInit(): void {
  }

  scrollTo(tab: ScrollTabOption) {
    const el = document.getElementById(tab.scrollTo);
    if (!this.isKPI) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
    } else {
      const container = document.querySelector('[scrollSpy]') as HTMLElement;
      if (!el || !container) return;
      const elementY = el.offsetTop;

      container.scrollTo({
        top: elementY,
        behavior: 'smooth'
      });
    }
  }


  onShowInfoChangeClick() {
    this.infoChangeModal = this.modalService.create({
      nzWidth: window.innerWidth > 767 ? window.innerWidth / 1.5 > 1100 ? 1100 : window.innerWidth / 1.5 : window.innerWidth,
      nzContent: this.component,
      nzTitle: this.translate.instant('common.table.infoChange.titleHeader'),
      nzFooter: this.footerTmpl
    });
  }

  cancel() {
    this.infoChangeModal.destroy();
  }
}
