export class EmployeesModel {
  employeeId?: number;
  employeeCode?: string;
  fullName?: string;
  email?: string;
  mobileNumber?: string;
  organizationId?: number;
  organizationName?: string;
  positionId?: number;
  positionName?: string;
  jobId?: number;
  jobName?: string;
  isDeleted?: string;
  createdBy?: string;
  createdTime?: string;
  modifiedBy?: string;
  modifiedTime?: string;
  lastUpdateTime?: string;
  aliasName?: string;
  dateOfBirth?: string;
  genderId?: string;
  religionId?: string;
  ethnicId?: string;
  personalEmail?: string;
  placeOfBirth?: string;
  originalAddress?: string;
  permanentAddress?: string;
  currentAddress?: string;
  familyPolicyId?: string;
  selfPolicyId?: string;
  provinceId?: string;
  districtId?: string;
  wardId?: string;
  villageAddress?: string;
  currentProvinceId?: string;
  currentDistrictId?: string;
  currentWardId?: string;
  currentVillageAddress?: string;
  listContactAddresses?: ContactAddressModels[];
}

export class ContactAddressModels {
  contactAddressId?: number;
  provinceId?: string;
  districtId?: string;
  wardId?: string;
  villageAddress?: string;
  addressType?: string;
}


