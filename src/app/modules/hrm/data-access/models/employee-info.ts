export class EmployeesInfo {
  static SearchResult = class {
    employeeId!: number;
    employeeCode!: string;
    fullName!: string;
    email!: string;
    mobileNumber!: string;
    organizationId!: number;
    positionId!: number;
    jobId!: number;
    orgName!: string;
    jobName!: string;
    genderName!: string;
    ethnicName!: string;
    religionName!: string;
    placeOfBirth!: string;
    originalAddress!: string;
    permanentAddress!: string;
    currentAddress!: string;
    genderId!: string;
    religionId!: string;
    ethnicId!: string;
    personalEmail!: string;
    familyPolicyId!: string;
    selfPolicyId!: string;
    taxNo!: string;
    insuranceNo!: string;
    identityNo!: string;
    status!: string;
    empTypeId!: number;
    label!: string;

    constructor(init?: Partial<typeof EmployeesInfo.SearchResult.prototype>) {
      Object.assign(this, init);
    }
  };

  static PersonalInfo = class {
    employeeId!: number;
    employeeCode!: string;
    fullName!: string;
    positionTitle!: string | null;
    organizationName!: string;
    email!: string;
    infoBeans: InfoBean[] = [];

    constructor(init?: Partial<typeof EmployeesInfo.PersonalInfo.prototype>) {
      Object.assign(this, init);
    }

    getInfoByType(infoType: string): InfoBean | undefined {
      return this.infoBeans.find(bean => bean.infoType === infoType);
    }
  };
}

export class InfoBean {
  infoType!: string;
  details: InfoDetailBean[] = [];

  constructor(infoType: string) {
    this.infoType = infoType;
  }

  addInfo(code: string, label: string, value: string, colsSpan: number) {
    this.details.push(new InfoDetailBean(code, label, value, colsSpan));
  }
}

export class InfoDetailBean {
  code!: string;
  label!: string;
  value!: string;
  colsSpan!: number;

  constructor(code: string, label: string, value: string, colsSpan: number) {
    this.code = code;
    this.label = label;
    this.value = value;
    this.colsSpan = colsSpan;
  }
}