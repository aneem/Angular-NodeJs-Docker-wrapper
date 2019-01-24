import { Injectable } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd';

@Injectable()
export class NotificationService {
  private options = { nzDuration: 3000 };
  constructor(private ns: NzNotificationService) {}

  public success(title: string, body: string) {
    this.ns.success(title, body, this.options);
  }

  public warn(title: string, body: string) {
    this.ns.warning(title, body, this.options);
  }

  public error(title: string, body: string) {
    this.ns.error(title, body, this.options);
  }

  public info(title: string, body: string) {
    this.ns.info(title, body, this.options);
  }
}
