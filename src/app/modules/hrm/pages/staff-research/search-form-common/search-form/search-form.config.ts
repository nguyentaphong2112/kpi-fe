import { Constant } from '@app/modules/hrm/data-access/constant/constant.class';
import { environment } from '@env/environment';

export const SEARCH_INFO_TYPE = [
  {
    value: 'basics',
    label: 'hrm.staffManager.staffResearch.pageName.basicInfo',
    url: '/hrm/research/basics',
    functionCode: 'HR_EMPLOYEES'
  }
];

export const SEARCH_FORM_ADVANCE: any[] = [
  {
    code: 'listDateOfBirth',
    inputType: 'date',
    inputLabel: 'Ngày sinh',
    moduleName: ['ALL']
  },
  {
    code: 'listEthnic',
    inputType: 'multi-combobox',
    inputLabel: 'Dân tộc',
    dataSourceType: 'REST_URL',
    dataSourceValue: environment.backend.admin + '/v1/category/list/DAN_TOC',
    moduleName: ['ALL']
  },
  {
    code: 'listReligion',
    inputType: 'multi-combobox',
    inputLabel: 'Tôn giáo',
    dataSourceType: 'REST_URL',
    dataSourceValue: environment.backend.admin + '/v1/category/list/TON_GIAO',
    moduleName: ['ALL']
  },
  {
    code: 'mobileNumber',
    inputType: 'text',
    inputLabel: 'Số điện thoại',
    moduleName: ['ALL']
  },
  {
    code: 'taxNo',
    inputType: 'text',
    inputLabel: 'Mã số thuế',
    moduleName: ['ALL']
  },
  {
    code: 'insuranceNo',
    inputType: 'text',
    inputLabel: 'Số sổ BHXH',
    moduleName: ['ALL']
  },
  {
    code: 'ages',
    inputType: 'multi-combobox',
    inputLabel: 'Độ tuổi',
    dataSourceType: 'REST_URL',
    keyValue: 'name',
    dataSourceValue: environment.backend.admin + '/v1/category/list/DO_TUOI',
    moduleName: ['ALL']
  },
  {
    code: 'majorLevelList',
    inputType: 'multi-combobox',
    inputLabel: 'Trình độ',
    dataSourceType: 'REST_URL',
    dataSourceValue: environment.backend.admin + '/v1/category/list/TRINH_DO_DAO_TAO',
    moduleName: ['ALL']
  },
  {
    code: 'majorName',
    inputType: 'text',
    inputLabel: 'Chuyên ngành đào tạo',
    moduleName: ['ALL']
  },
  {
    code: 'listIdentityType',
    inputType: 'multi-combobox',
    inputLabel: 'Loại giấy tờ',
    dataSourceType: 'REST_URL',
    dataSourceValue: environment.backend.admin + '/v1/category/list/LOAI_GIAY_TO',
    moduleName: [Constant.MODULE_NAME.IDENTITY]
  },
  {
    code: 'identityNo',
    inputType: 'text',
    inputLabel: 'Số giấy tờ',
    moduleName: [Constant.MODULE_NAME.IDENTITY]
  },
  {
    code: 'listAccountType',
    inputType: 'multi-combobox',
    inputLabel: 'Loại tài khoản',
    dataSourceType: 'REST_URL',
    dataSourceValue: environment.backend.admin + '/v1/category/list/LOAI_TAI_KHOAN',
    moduleName: [Constant.MODULE_NAME.BANK_ACCOUNT]
  },
  {
    code: 'accountNo',
    inputType: 'text',
    inputLabel: 'Số tài khoản',
    moduleName: [Constant.MODULE_NAME.BANK_ACCOUNT]
  },
  {
    code: 'listBank',
    inputType: 'multi-combobox',
    inputLabel: 'Ngân hàng',
    dataSourceType: 'REST_URL',
    dataSourceValue: environment.backend.admin + '/v1/category/list/NGAN_HANG',
    moduleName: [Constant.MODULE_NAME.BANK_ACCOUNT]
  },
  {
    code: 'bankBranch',
    inputType: 'text',
    inputLabel: 'Chi nhánh',
    moduleName: [Constant.MODULE_NAME.BANK_ACCOUNT]
  },
  {
    code: 'fullName',
    inputType: 'text',
    inputLabel: 'Họ tên thân nhân',
    moduleName: [Constant.MODULE_NAME.FAMILY_RELATIONSHIPS]
  },
  {
    code: 'personalIdNo',
    inputType: 'text',
    inputLabel: 'Số định danh thân nhân',
    moduleName: [Constant.MODULE_NAME.FAMILY_RELATIONSHIPS]
  },
  {
    code: 'familyMobileNumber',
    inputType: 'text',
    inputLabel: 'SĐT thân nhân',
    moduleName: [Constant.MODULE_NAME.FAMILY_RELATIONSHIPS]
  },
  {
    code: 'listPolicyType',
    inputType: 'multi-combobox',
    inputLabel: 'Loại đối tượng chính sách',
    dataSourceType: 'REST_URL',
    dataSourceValue: environment.backend.admin + '/v1/category/list/DOI_TUONG_CHINH_SACH',
    moduleName: [Constant.MODULE_NAME.FAMILY_RELATIONSHIPS]
  },
  {
    code: 'listRelationStatus',
    inputType: 'multi-combobox',
    inputLabel: 'Tình trạng thân nhân',
    dataSourceType: 'REST_URL',
    dataSourceValue: environment.backend.admin + '/v1/category/list/TINH_TRANG_TN',
    moduleName: [Constant.MODULE_NAME.FAMILY_RELATIONSHIPS]
  },
  {
    code: 'listRelationType',
    inputType: 'multi-combobox',
    inputLabel: 'Mối quan hệ',
    dataSourceType: 'REST_URL',
    dataSourceValue: environment.backend.admin + '/v1/category/list/MOI_QUAN_HE_TN',
    moduleName: [Constant.MODULE_NAME.FAMILY_RELATIONSHIPS]
  },
  {
    code: 'companyName',
    inputType: 'text',
    inputLabel: 'Đơn vị trước tuyển dụng',
    moduleName: [Constant.MODULE_NAME.WORK_OUT]
  },
  {
    code: 'job',
    inputType: 'text',
    inputLabel: 'Chức danh trước tuyển dụng',
    moduleName: [Constant.MODULE_NAME.WORK_OUT]
  },
  {
    code: 'documentNo',
    inputType: 'text',
    inputLabel: 'Số quyết định',
    moduleName: [
      Constant.MODULE_NAME.WORK_PROCESS, Constant.MODULE_NAME.CONCURRENT_PROCESS,
      Constant.MODULE_NAME.INSURANCE_SALARY, Constant.MODULE_NAME.POSITION_SALARY_PROCESS,
      Constant.MODULE_NAME.ALLOWANCE, Constant.MODULE_NAME.AWARD, Constant.MODULE_NAME.DISCIPLINE
    ]
  },
  {
    code: 'listDocumentSignedDate',
    inputType: 'date',
    inputLabel: 'Ngày ký quyết định',
    moduleName: [
      Constant.MODULE_NAME.WORK_PROCESS, Constant.MODULE_NAME.CONCURRENT_PROCESS,
      Constant.MODULE_NAME.INSURANCE_SALARY, Constant.MODULE_NAME.POSITION_SALARY_PROCESS,
      Constant.MODULE_NAME.ALLOWANCE, Constant.MODULE_NAME.AWARD, Constant.MODULE_NAME.DISCIPLINE
    ]
  },
  {
    code: 'listStartDate',
    inputType: 'date',
    inputLabel: 'Từ ngày',
    dataSourceType: 'REST_URL',
    moduleName: [
      Constant.MODULE_NAME.WORK_PROCESS, Constant.MODULE_NAME.CONCURRENT_PROCESS, Constant.MODULE_NAME.CONTRACT,
      Constant.MODULE_NAME.INSURANCE_SALARY, Constant.MODULE_NAME.POSITION_SALARY_PROCESS, Constant.MODULE_NAME.ALLOWANCE
    ]
  },
  {
    code: 'listContractType',
    inputType: 'multi-combobox',
    inputLabel: 'Loại hợp đồng',
    dataSourceType: 'REST_URL',
    dataSourceValue: environment.backend.hrm + '/v1/contract-types/list',
    moduleName: [Constant.MODULE_NAME.CONTRACT],
    keyValue: 'contractTypeId',
    valueIsNumber: true
  },
  {
    code: 'documentNo',
    inputType: 'text',
    inputLabel: 'Số hợp đồng',
    moduleName: [Constant.MODULE_NAME.CONTRACT]
  },
  {
    code: 'listDocumentSignedDate',
    inputType: 'date',
    inputLabel: 'Ngày ký',
    moduleName: [Constant.MODULE_NAME.CONTRACT]
  },
  {
    code: 'listYear',
    inputType: 'number',
    inputLabel: 'Năm đánh giá',
    moduleName: [Constant.MODULE_NAME.EVALUATION_RESULTS]
  },
  {
    code: 'listEvaluationPeriod',
    inputType: 'multi-combobox',
    inputLabel: 'Kỳ đánh giá',
    dataSourceType: 'REST_URL',
    dataSourceValue: environment.backend.hrm + '/v1/evaluation-results/evaluation_periods',
    moduleName: [Constant.MODULE_NAME.EVALUATION_RESULTS],
    keyValue: 'evaluationPeriodId',
    valueIsNumber: true
  },
  {
    code: 'listTrainingSchool',
    inputType: 'multi-combobox',
    inputLabel: 'Trường đào tạo',
    dataSourceType: 'REST_URL',
    dataSourceValue: environment.backend.admin + '/v1/category/list/TRUONG_DAO_TAO',
    moduleName: [Constant.MODULE_NAME.EDUCATION_DEGREE]
  },
  {
    code: 'listMajor',
    inputType: 'multi-combobox',
    inputLabel: 'Chuyên ngành',
    dataSourceType: 'REST_URL',
    dataSourceValue: environment.backend.admin + '/v1/category/list/CHUYEN_NGANH',
    moduleName: [Constant.MODULE_NAME.EDUCATION_DEGREE]
  },
  {
    code: 'listMajorLevel',
    inputType: 'multi-combobox',
    inputLabel: 'Trình độ đào tạo',
    dataSourceType: 'REST_URL',
    dataSourceValue: environment.backend.admin + '/v1/category/list/TRINH_DO_DAO_TAO',
    moduleName: [Constant.MODULE_NAME.EDUCATION_DEGREE]
  },
  {
    code: 'listCertificateType',
    inputType: 'multi-combobox',
    inputLabel: 'Loại chứng chỉ',
    dataSourceType: 'REST_URL',
    dataSourceValue: environment.backend.admin + '/v1/category/list/LOAI_CHUNG_CHI',
    moduleName: [Constant.MODULE_NAME.EDUCATION_CERTIFICATE]
  },
  {
    code: 'listCertificate',
    inputType: 'multi-combobox',
    inputLabel: 'Chứng chỉ',
    dataSourceType: 'REST_URL',
    dataSourceValue: environment.backend.admin + '/v1/category/list/TEN_CHUNG_CHI',
    moduleName: [Constant.MODULE_NAME.EDUCATION_CERTIFICATE]
  },
  {
    code: 'issuedPlace',
    inputType: 'text',
    inputLabel: 'Nơi cấp',
    moduleName: [Constant.MODULE_NAME.EDUCATION_CERTIFICATE]
  },
  {
    code: 'listTrainingMethod',
    inputType: 'multi-combobox',
    inputLabel: 'Hình thức đào tạo',
    dataSourceType: 'REST_URL',
    dataSourceValue: environment.backend.admin + '/v1/category/list/HINH_THUC_DAO_TAO',
    moduleName: [Constant.MODULE_NAME.EDUCATION_PROCESS]
  },
  {
    code: 'courseName',
    inputType: 'text',
    inputLabel: 'Tên khóa học',
    moduleName: [Constant.MODULE_NAME.EDUCATION_PROCESS]
  },
  {
    code: 'result',
    inputType: 'text',
    inputLabel: 'Kết quả đào tạo',
    moduleName: [Constant.MODULE_NAME.EDUCATION_PROCESS]
  },
  {
    code: 'listPromotionRank',
    inputType: 'multi-combobox',
    inputLabel: 'Học hàm',
    dataSourceType: 'REST_URL',
    dataSourceValue: environment.backend.admin + '/v1/category/list/HR_HOC_HAM',
    moduleName: [Constant.MODULE_NAME.EDUCATION_PROMOTIONS]
  },
  {
    code: 'listYear',
    inputType: 'number',
    inputLabel: 'Năm phong tặng',
    moduleName: [Constant.MODULE_NAME.EDUCATION_PROMOTIONS]
  },
  {
    code: 'listJobSalary',
    inputType: 'multi-combobox',
    inputLabel: 'Chức danh hưởng lương',
    dataSourceType: 'REST_URL',
    dataSourceValue: environment.backend.hrm + '/v1/jobs/list?jobType=HUONG_LUONG',
    moduleName: [Constant.MODULE_NAME.INSURANCE_SALARY],
    keyValue: 'jobId',
    valueIsNumber: true
  },
  {
    code: 'listSalaryRank',
    inputType: 'multi-combobox',
    inputLabel: 'Ngạch lương',
    dataSourceType: 'REST_URL',
    dataSourceValue: environment.backend.hrm + '/v1/salary-ranks/list/CO_BAN',
    moduleName: [Constant.MODULE_NAME.INSURANCE_SALARY],
    keyValue: 'salaryRankId',
    valueIsNumber: true
  },
  {
    code: 'listSalaryRank',
    inputType: 'multi-combobox',
    inputLabel: 'Ngạch lương',
    dataSourceType: 'REST_URL',
    dataSourceValue: environment.backend.hrm + '/v1/salary-ranks/list/CHUC_DANH',
    moduleName: [Constant.MODULE_NAME.POSITION_SALARY_PROCESS],
    keyValue: 'salaryRankId',
    valueIsNumber: true
  },
  {
    code: 'listDocumentType',
    inputType: 'multi-combobox',
    inputLabel: 'Loại quyết định',
    dataSourceType: 'REST_URL',
    dataSourceValue: environment.backend.hrm + '/v1/document-types/list',
    moduleName: [Constant.MODULE_NAME.WORK_PROCESS],
    keyValue: 'documentTypeId',
    valueIsNumber: true
  },
  {
    code: 'listAllowanceType',
    inputType: 'multi-combobox',
    inputLabel: 'Loại phụ cấp',
    dataSourceType: 'REST_URL',
    dataSourceValue: environment.backend.admin + '/v1/category/list/LOAI_PHU_CAP',
    moduleName: [Constant.MODULE_NAME.ALLOWANCE]
  },
  {
    code: 'listAwardForm',
    inputType: 'multi-combobox',
    inputLabel: 'Hình thức khen thưởng',
    dataSourceType: 'REST_URL',
    dataSourceValue: environment.backend.admin + '/v1/category/list/HINH_THUC_KHEN_THUONG',
    moduleName: [Constant.MODULE_NAME.AWARD]
  },
  {
    code: 'listYear',
    inputType: 'number',
    inputLabel: 'Năm khen thưởng',
    moduleName: [Constant.MODULE_NAME.AWARD]
  },
  {
    code: 'listDisciplineForm',
    inputType: 'multi-combobox',
    inputLabel: 'Hình thức kỷ luật',
    dataSourceType: 'REST_URL',
    dataSourceValue: environment.backend.admin + '/v1/category/list/HINH_THUC_KY_LUAT',
    moduleName: [Constant.MODULE_NAME.DISCIPLINE]
  }
];
