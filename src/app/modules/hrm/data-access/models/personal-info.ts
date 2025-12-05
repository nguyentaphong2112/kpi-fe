export interface PersonalInfo {
  employeeId?: number,
  avatar?: string , // Ảnh đại diện
  employeeCode?: string, // Mã nhân viên
  fullName?: string, // Tên nhân viên
  email?: string, // Email
  genderCode?: string, // Mã giới tính
  genderName?: string, // Text giới tính
  dateOfBirth?: string, // Ngày sinh
  maritalStatusCode?: string, // Mã tình trạng hôn nhân
  maritalStatusName?: string, // Tình trạng hôn nhân
  mobileNumber?: string, // Số điện thoại (ngoài list),
  listMobileNumber?: ListMobileNumber[], // Danh sách số điện thoại
  personalEmail?: string, // Email cá nhân
  companyPhone?: string , // Số điện thoại công ty
  nationCode?: string , // Mã quốc tịch
  nationName?: string , // Quốc tịch
  ethnicCode?: string , // Mã dân tộc
  ethnicName?: string , // Dân tộc
  religionCode?: string , // Mã tôn giáo
  religionName?: string , //Tôn giáo
  isInsuranceMb?: number, // Tham gia BHXH 1: có, 0: không
  insuranceNo?: string, // Số sổ bhxh
  taxNo?: string, // Mã số thuế
  empTypeName?: string, // Đối tượng
  positionName?: string, // Chức danh
  jobName?: string, // Ten job
  positionLevel?: string, //bac chuc danh
  orgName?: string // Đơn vị
  empTypeCode?: string, // Đối tượng code
  positionCode?: string, // Chức danh code
  orgCode?: string // Đơn vị code
  status?: number // Trạng thai
  mbSeniority?: number // Tham nien tai MB tai thoi diem hien tai
  statusStr?: string // Trạng thai
  personalIdNumber?: string, // cmd/cccd
  currentAddress?: string, // Địa chỉ hiện tại
  joinCompanyDate?: string, //Ngày gia nhập HBTPlus
  otherPositionName?: string, //chuc danh kiêm nhiệm
  advisorBuddyInfo?: AdvisorBuddyInfo
}

export interface AdvisorBuddyInfo {
  mentor: AdvisorBuddyPersonalInfo | null,
  mentees: AdvisorBuddyPersonalInfo[] | null
}

export interface AdvisorBuddyPersonalInfo {
  employeeCode?: string,
  employeeId?: number,
  email?: string,
  fullName?: string,
}

export interface ListMobileNumber {
  phoneNumber?: string,
  phoneAreaCode?: string,
  isMain?: number,
}

export class EmployeeDetail {
  employeeId: number;
  employeeCode: string;
  fullName: string; //Tên nhân viên
  jobName: string; //Nghề nghiệp
  dateOfBirth: string; //Ngày sinh
  personalId: string; //Số CMND
  email: string; //Email nhân viên
  positionName?: string; // Chức danh
  orgName?: string; // Đơn vị
  imagePath?: string; // Đường dẫn avatar
  flagStatus?: number; //Trạng thái làm việc. 1: Đang làm việc, 0: Đã nghỉ việc
  currentAddress?: string;
  department?:string;
  taxNo?: string;
  taxPlace?: string;
  yearOfBirth?: number;
  empStatusName?: string;
  genderName?: string;
  mobileNumber?: string;
  fullJobName?: string;
}
