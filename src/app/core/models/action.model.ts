export class ActionSchema {
  arrAction: ChildActionSchema[];

  constructor(init?: ActionSchema) {
    for (const key in init) {
      this[key] = init[key];
    }
  }
}

export class ChildActionSchema {
  children?: ChildLevel2ActionSchema[];
  arrAction?: never;
  disabled?: Function = () => {
    return false;
  };
  isShow?: boolean = true;
  isShowFn?: Function = () => {
    return true;
  };
  scope?: string;
  function: Function;
  label: string;
  icon?: string;

  constructor(init?: ChildActionSchema) {
    for (const key in init) {
      this[key] = init[key];
    }
  }
}

export class ChildLevel2ActionSchema {
  disabled?: Function = () => false;
  isShow?: boolean = true;
  isShowFn?: Function = () => true;
  scope?: string;
  function: Function;
  label: string;
  icon?: string;

  constructor(init?: ChildLevel2ActionSchema) {
    for (const key in init) {
      this[key] = init[key];
    }
  }
}
