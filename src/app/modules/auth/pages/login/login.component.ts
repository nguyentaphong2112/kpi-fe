import { Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@shared/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { HTTP_STATUS_CODE } from '@core/constant/system.constants';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { environment } from '@env/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  bgLoginPath = environment.bgLogin;
  isModal = false;
  isSubmitted = false;
  isLoading = false;
  isFocus = false;
  form: FormGroup = this.fb.group({
    loginName: [null, Validators.required],
    password: [null, Validators.required]
  });

  modalRef: NzModalRef;

  constructor(
    private fb: FormBuilder,
    private readonly router: Router,
    private toastrService: ToastrService,
    private authService: AuthService,
    private translate: TranslateService,
    injector: Injector
  ) {
    try {
      this.modalRef = injector.get(NzModalRef);
    } catch (error) {
      this.modalRef = null;
    }
  }

  ngOnInit(): void {
    if (!this.isModal && this.authService.isAuthenticated()) {
      this.router.navigateByUrl('/');
    }
  }

  get f() {
    return this.form.controls;
  }
  onLabelClick() {
    this.isFocus = !this.isFocus;
  }


  submitForm(): void {
    this.isSubmitted = true;
    if (this.form.valid) {
      this.login();
    } else {
      Object.values(this.form.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  preventSpace(event: KeyboardEvent) {
    if (event.key === ' ') {
      event.preventDefault();
    }
  }

  async login() {
    this.isLoading = true;
    const fromObject = {
      loginName: this.form.get('loginName')?.value.trim(),
      password: this.form.get('password')?.value.trim()
    };
    this.authService.login(fromObject).subscribe(res => {
      if (res && res.code === HTTP_STATUS_CODE.SUCCESS) {
        this.authService.clearData();
        this.authService.saveStorage(res);
        if (!this.isModal) {
          this.router.navigate(['/']);
        } else {
          this.modalRef?.close(true);
        }
      } else {
        this.toastrService.error(this.translate.instant(res?.error));
      }
      this.isLoading = false;
    }, error => {
      this.isLoading = false;
    });
  }

  loginWithGuest() {
    this.isLoading = true;
    this.authService.loginWithGuest().subscribe(res => {
      if (res && res.code === HTTP_STATUS_CODE.SUCCESS) {
        this.authService.clearData();
        this.authService.saveStorage(res);
        this.router.navigate(['/']);
      } else {
        this.toastrService.error(this.translate.instant(res?.error));
      }
      this.isLoading = false;
    }, error => {
      this.isLoading = false;
    });
  }

  openChangePassword(): void {
    this.router.navigateByUrl('/login/change-password');
  }
}
