export class HeaderEventEmit {
  prefix = 'HEADER_EVENT';
  subject: 'TRIGGER' | 'SEARCH' | 'CHAT' | 'NOTIFY' | 'USER';
  action: 'CLICK' | 'PUSH' | 'ENTER' | string;
  data?: any;

  constructor(subject: 'TRIGGER' | 'SEARCH' | 'CHAT' | 'NOTIFY' | 'USER', action: 'CLICK' | 'PUSH' | 'ENTER' | string,
              data?: any) {
    this.subject = subject;
    this.action = action;
    this.data = data;
  }
}
