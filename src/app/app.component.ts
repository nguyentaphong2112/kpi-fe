import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NzI18nService, vi_VN } from 'ng-zorro-antd/i18n';
import { vi } from 'date-fns/locale';
import { Title } from '@angular/platform-browser';
import { environment } from '@env/environment';

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>',
  styles: [`
  ::ng-deep .snackbar-style {
    background-color: brown;
    color: white;
  }
  ::ng-deep .ant-modal-body {
    padding: 5px 24px 16px;
  }
  `]
})
export class AppComponent implements OnInit {
  constructor(private titleService: Title,
              private readonly translate: TranslateService,
              private readonly router: Router,
              private readonly i18n: NzI18nService) {
    i18n.setLocale(vi_VN);
    i18n.setDateLocale(vi);
    translate.addLangs(['vn', 'en']);
    translate.use('vn');
  }

  ngOnInit(): void {
    this.router.config.forEach(route => {
      if (route.path === '') {
        // route.children?.forEach(childRoute => {
        //   if (childRoute.path !== '') {
        //     if (childRoute.loadChildren) {
        //       childRoute.canActivateChild = childRoute.canActivateChild ? childRoute.canActivateChild : [RoleGuardService];
        //     } else {
        //       childRoute.canActivate = childRoute.canActivate ? childRoute.canActivate : [RoleGuardService];
        //     }
        //   }
        // });
      }
    });
    this.setFavicon(environment.favicon);
    this.setTitle(environment.title);
  }

  setFavicon(iconUrl: string) {
    const link: HTMLLinkElement = document.querySelector('link[rel*="icon"]') || document.createElement('link');
    link.type = 'image/x-icon';
    link.rel = 'shortcut icon';
    link.href = iconUrl;
    document.getElementsByTagName('head')[0].appendChild(link);
  }

  setTitle(newTitle: string): void {
    this.titleService.setTitle(newTitle);
  }
}
