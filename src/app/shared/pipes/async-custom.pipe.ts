import { Pipe, PipeTransform, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

@Pipe({
  name: 'asyncCustom',
  pure: false // Pipe không thuần để thay đổi khi có dữ liệu bất đồng bộ
})
export class AsyncCustomPipe implements PipeTransform, OnDestroy {
  private latestValue: any = null;
  private subscription: Subscription | null = null;
  private currentObservable: Observable<any> | null = null;
  private currentPromise: Promise<any> | null = null;

  constructor(private cd: ChangeDetectorRef) {}

  transform(value: Observable<any> | Promise<any>): any {
    // Nếu là Observable
    if (value instanceof Observable) {
      // Nếu nhận Observable mới thì đăng ký lại
      if (this.currentObservable !== value) {
        this.unsubscribe(); // Hủy đăng ký cũ nếu có
        this.currentObservable = value;
        this.subscription = value.subscribe(result => {
          this.latestValue = result;
          this.cd.markForCheck(); // Cập nhật Change Detection
        });
      }
    }

    // Nếu là Promise
    if (value instanceof Promise) {
      // Nếu nhận Promise mới thì xử lý lại
      if (this.currentPromise !== value) {
        this.currentPromise = value;
        this.latestValue = null; // Reset giá trị để chờ dữ liệu
        value.then(result => {
          this.latestValue = result;
          this.cd.markForCheck(); // Cập nhật Change Detection
        });
      }
    }

    return this.latestValue;
  }

  // Hủy đăng ký khỏi Observable khi pipe không còn cần thiết
  ngOnDestroy(): void {
    this.unsubscribe();
  }

  private unsubscribe(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }
    this.currentObservable = null;
  }
}