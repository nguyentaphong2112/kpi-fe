import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '@shared/services/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { HTTP_STATUS_CODE } from '@core/constant/system.constants';
import { Location } from '@angular/common';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  form: FormGroup = this.fb.group({
    loginName: [null, Validators.required],
    oldPassword: [null, Validators.required],
    password: [null, Validators.required],
    retypePassword: [null, Validators.required],
    captcha: [null, Validators.required]
  });
  isSubmitted = false;
  isFocus1 = false;
  isFocus2 = false;
  isFocus3 = false;
  captcha = '';
  isLoading = false;

  constructor(
    private authService: AuthService,
    private readonly router: Router,
    private toastrService: ToastrService,
    private translate: TranslateService,
    private fb: FormBuilder,
    private location: Location
  ) {
  }

  ngOnInit(): void {
    this.generateRandomString();
  }

  onInputChange1($event: any) {
    if ($event === '') {
      this.isFocus1 = false;
    }
  }

  onInputChange2($event: any) {
    if ($event === '') {
      this.isFocus2 = false;
    }
  }

  onInputChange3($event: any) {
    if ($event === '') {
      this.isFocus3 = false;
    }
  }

  get f() {
    return this.form.controls;
  }

  onLabelClick1() {
    this.isFocus1 = !this.isFocus1;
  }

  onLabelClick2() {
    this.isFocus2 = !this.isFocus2;
  }

  onLabelClick3() {
    this.isFocus3 = !this.isFocus3;
  }

  preventSpace(event: KeyboardEvent) {
    if (event.key === ' ') {
      event.preventDefault();
    }
  }

  back() {
    this.location.back();
  }

  submitForm(): void {
    this.isSubmitted = true;
    if (this.form.valid) {
      if (this.f.captcha.value !== this.captcha) {
        this.toastrService.error(this.translate.instant('common.user.validate.errorCaptcha'));
        this.generateRandomString();
        return;
      }
      if (this.f.password.value === this.f.oldPassword.value) {
        this.toastrService.error(this.translate.instant('common.user.validate.errorPassword'));
        this.generateRandomString();
        return;
      }
      if (this.f.password.value !== this.f.retypePassword.value) {
        this.toastrService.error(this.translate.instant('common.user.validate.errorRetypePassword'));
        this.generateRandomString();
        return;
      }
      if (this.validatePassword(this.f.password.value) !== null) {
        this.toastrService.error(this.validatePassword(this.f.password.value));
        this.generateRandomString();
        return;
      }
      this.isLoading = true;
      const fromObject = this.form.value;
      this.authService.changePassword(fromObject).subscribe(res => {
        if (res && res.code === HTTP_STATUS_CODE.SUCCESS) {
          this.toastrService.success(this.translate.instant('common.user.validate.success'));
          this.authService.clearData();
          this.router.navigateByUrl('/login');
        } else {
          this.isLoading = false;
          this.toastrService.error(res?.message);
          this.generateRandomString();
        }
      }, error => {
        this.generateRandomString();
        this.isLoading = false;
      });
    }
  }

  generateRandomString(length = 5) {
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters[randomIndex];
    }
    this.f.captcha.setValue('');
    this.captcha = result;
  }

  validatePassword(password) {
    const specialCharacters = /[~!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
    const lowercase = /[a-z]/;
    const uppercase = /[A-Z]/;
    const digits = /[0-9]/;
    // const forbiddenStarts = /^(123|456|789|147|258|852|741|abc|369)/;
    // const easyWords = [
    //   'qwerty', 'password', 'passw0rd', 'password@123', 'abc123',
    //   'iloveyou', 'viettel@123', 'admin@123', '123qwe', '@bc',
    //   'qwerty@123', 'vtt@2014', '123@123', '123123', '696969'
    // ];
    // const personalInfo = ['hoten', 'ngaysinh', 'sodienthoai', 'sochungthu'];
    // const incrementalPatterns = /(\d)\1{3}/;
    if (password.length < 8) {
      return this.translate.instant('common.user.validate.error');
    }
    if (!lowercase.test(password) || !uppercase.test(password) || !digits.test(password) || !specialCharacters.test(password)) {
      return this.translate.instant('common.user.validate.error');
    }
    // if (forbiddenStarts.test(password)) {
    //   return this.translate.instant('common.user.validate.error');
    // }
    // for (const word of easyWords) {
    //   if (password.includes(word)) {
    //     return this.translate.instant('common.user.validate.error').replace('{word}', word);
    //   }
    // }
    // for (const info of personalInfo) {
    //   if (password.includes(info)) {
    //     return this.translate.instant('common.user.validate.error');
    //   }
    // }
    // if (incrementalPatterns.test(password)) {
    //   return this.translate.instant('common.user.validate.error');
    // }
    return null;
  }
}
