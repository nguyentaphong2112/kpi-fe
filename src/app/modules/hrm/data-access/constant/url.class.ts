export class UrlConstant {
  public static readonly API_VERSION = '/v1';
  public static readonly DOWNLOAD_FILE_ATTACH = '/download/file?docId=';
  public static readonly PARAMETER_CONFIG = '/parameter';
  public static readonly GET_EVALUATION_PERIODS = '/evaluation-results/evaluation_periods';


  public static readonly SALARIES = {
    LIST_SALARY_RANKS: '/salary-ranks/list/CO_BAN',
    LIST_POS_SALARY_RANKS: '/salary-ranks/list/{type}',
    LIST_SALARY_GRADES: '/salary-ranks/grades/{rankId}'
  };

  public static readonly SALARY_REVIEWS = {
    PREFIX: '/salary-reviews',
    MAKE_LIST: '/salary-reviews/make-list',
    EXPORT: '/salary-reviews/export',
  };

  public static readonly CATEGORY_ADDRESS = {
    GET_DISTRICT: '/district/list',
    GET_WARDS: '/ward/list',
    GET_WARD_BY_PROVINCE: '/ward/list-of-province'
  };

  public static readonly CATEGORY = {
    GET_BY_PARENT: '/category/list-by-parent/{categoryType}',
    GET_LIST_FAMILY: '/category/list/THANH_PHAN_GIA_DINH',
    GET_LIST_SELF: '/category/list/THANH_PHAN_BAN_THAN',
    GET_LIST_GROUP_TYPE: '/category/list/GROUP_NHOM_CHUC_DANH',
    GET_CATEGORIES: '/list/{typeCode}'
  };
  public static readonly ORGANIZATIONS_TREE = {
    SEARCH: '/organization-tree/search',
    LOAD_NODE: '/organization-tree/root-nodes',
    LOAD_CHILDREN: '/organization-tree/children-nodes'
  };

  public static readonly POLITICAL_INFO = {
    PREFIX: '/political-info'
  };

  public static readonly ORGANIZATIONS = {
    PREFIX: '/organizations',
    EXPORT: '/organizations/export',
    GET_BY_ID: '/organizations/{id}',
    GET_LIST_PAYROLL: '/organizations/get-list-payroll',
    EXPORT_LIST_PAYROLL: '/organizations/get-list-payroll/export',
    GET_HIERARCHY: '/hierarchy/{id}',
    GET_CHART: '/organizations/chart/{chartType}',
    GET_REPORT_LABOR_STRUCTURE: '/chart-labor-structure'
  };

  // Quá trình hợp đồng
  public static readonly CONTRACT_HISTORY_INFO = {
    PREFIX: '/contract-processes',
    LIST: '/employees/{employeeId}',
    SAVE: '',
    GET_BY_ID: '/contract-processes/{id}',
    GET_DRAFT_BY_ID: '/contract-processes/draft/{id}',
    DELETE: '/{contractProcessId}',
    DELETE_DRAFT: '/draft/{id}',
    DETAIL: '/{contractProcessId}',
    SUGGEST_CONTRACT_NUMBER: '/contract-processes/suggest-contract-number'
  };

  // Quá trình kiêm nhiệm
  public static readonly CONCURRENT_PROCESS_INFO = {
    PREFIX: '/concurrent-process',
    LIST: '/employees/{employeeId}',
    PAGE: '/pageable/{employeeId}',
    SAVE: '',
    DELETE: '/{concurrentProcessId}',
    DETAIL: '/{concurrentProcessId}',
    DELETE_DRAFT: '/draft/{concurrentProcessId}',
    GET_DRAFT_BY_ID: '/draft/{concurrentProcessId}'
  };

  // Quá trình tham gia dự án
  public static readonly PROJECT_HISTORY_INFO = {
    PREFIX: '/project-members',
    LIST: '/employees/{employeeId}',
    SAVE: '',
    DELETE: '/{projectMemberId}',
    DETAIL: '/{projectMemberId}'
  };

  // Danh sách thân nhân
  public static readonly RELATIVES_INFO = {
    PREFIX: '/family-relationships',
    LIST: '/employees/{employeeId}',
    SAVE: '',
    DELETE: '/{familyRelationshipId}',
    DETAIL: '/{familyRelationshipId}'
  };
  // Quá trình phụ cấp
  public static readonly ALLOWANCE_HISTORY_INFO = {
    PREFIX: '/allowance-processes',
    LIST: '/employees/{employeeId}',
    SAVE: '',
    DELETE: '/{allowanceProcessId}',
    GET_BY_ID: '/{id}',
    DETAIL: '/{allowanceProcessId}'
  };

  // Danh sách làm việc tại HBT
  public static readonly WORK_HISTORY = {
    PREFIX: '/work-processes',
    LIST: '/employees/{employeeId}',
    SAVE: '',
    DELETE: '/{workProcessId}',
    DELETE_DRAFT: '/delete-work-process/{id}',
    DETAIL: '/{workProcessId}',
    GET_BY_ID: '/{id}',
    GET_DRAFT_BY_ID: '/draft/{id}'
  };

  // Danh sách giảm trừ gia cảnh
  public static readonly FAMILY_DEDUCTION = {
    PREFIX: '/dependent-persons',
    LIST: '/employees/{employeeId}',
    RELATIVE_INFO: '/employees/{employeeId}/family-relationships',
    SAVE: '',
    DELETE: '/{dependentPersonId}',
    DETAIL: '/{dependentPersonId}'
  };

  public static readonly ONB_CANDIDATE_SALARIES = {
    DOWNLOAD_TEMPLATE: '/candidate-salaries/export-template',
    IMPORT_PROCESS: '/candidate-salaries/import-process',
    GET_BY_CANDIDATE_ID: '/candidate-salaries/candidates/{candidateId}',
    SAVE: '/candidate-salaries'
  };

  public static readonly ONB_FAMILY_RELATIONSHIP = {
    GET_BY_ID: '/onb-family-relationships/{id}',
    DELETE_BY_ID: '/onb-family-relationships/{id}',

    CANDIDATE_INFO: '/onb-family-relationships',
    SAVE_FAMILY_RELATIONSHIP_CANDIDATE: '/onb-family-relationships'
  };

  // Hồ sơ đính kèm
  public static readonly DOCUMENT_ATTACHMENT = {
    PREFIX: '/employee-profiles',
    LIST: '/employees/',
    SAVE: '',
    GET_BY_ID: '/employee-profiles/{id}',
    DELETE: '/{employee-profile-id}',
    DETAIL: '/{employee-profile-id}'
  };

  // Quá trình khen thưởng
  public static readonly REWARD_HISTORY_INFO = {
    PREFIX: '/reward-records',
    LIST: '/employees/{employeeId}',
    SAVE: '',
    DELETE: '/{rewardRecordId}',
    DETAIL: '/{rewardRecordId}'
  };
  // Quá trình khen thưởng
  public static readonly FAMILY_RELATIONSHIP = {
    PREFIX: '/family-relationships',
    PAGE: '/pageable/{employeeId}',
    LIST: '/employees/{employeeId}',
    SAVE: '',
    DELETE: '/{familyRelationshipId}',
    DETAIL: '/{familyRelationshipId}'
  };

  // Quá trình lương
  public static readonly SALARY_PROGRESS = {
    PREFIX: '/salary-processes',
    LIST: '/employees/{employeeId}',
    SAVE: '',
    DELETE: '/{salaryProcessId}',
    GET_BY_ID: '/{id}',
    DETAIL: '/{salaryProcessId}'
  };

  public static readonly EMPLOYEES = {
    PERSONAL: '/personal',
    PERSONAL_CT: 'personal',
    PREFIX: '/employees',
    EXPORT: '/export'
  };


  // Danh sách làm việc trước khi vào công ty
  public static readonly WORK_BEFORE_HISTORY = {
    PREFIX: '/worked-histories',
    PAGE: '/pageable/{employeeId}',
    LIST: '/employees/{employeeId}',
    EMP: '/employees',
    SAVE: '',
    DELETE: '/{workOutsideId}',
    GET_BY_ID: '/{id}',
    DETAIL: '/{workOutsideId}'
  };

  public static readonly PERSONAL_IDENTITIES = {
    PREFIX: '/personal-identities',
    LIST: '/pageable/{employeeId}'
  };

  public static readonly BANK_ACCOUNT = {
    PREFIX: '/bank-accounts',
    LIST: '/pageable/{employeeId}'
  };

  public static readonly EMPLOYEE_REQUESTS = {
    PREFIX: '/employee-requests',
    GET_UPDATE_INFO: '/update-employee-info/active/',
    UPDATE_EMPLOYEE: '/update-employee-info/next-status/'
  };

  public static readonly PARTICIPATION = {
    LIST: '/pageable/{employeeId}'
  };

  public static readonly EDU_DEGREES = {
    PREFIX: '/education-degrees',
    LIST: '/pageable/{employeeId}',
    IMPORT: '/education-degrees/import',
    DOWNLOAD_TEMPLATE: '/education-degrees/download-template'
  };

  public static readonly EDU_CERTIFICATES = {
    PREFIX: '/education-certificates',
    LIST: '/pageable/{employeeId}',
    IMPORT: '/education-certificates/import',
    DOWNLOAD_TEMPLATE: '/education-certificates/download-template'
  };
  public static readonly EDU_PROCESS = {
    PREFIX: '/education-process',
    LIST: '/pageable/{employeeId}'
  };
  public static readonly EDU_PROMOTIONS = {
    PREFIX: '/education-promotions',
    LIST: '/pageable/{employeeId}'
  };
  public static readonly AWARD_PROCESS = {
    PREFIX: '/award-process',
    LIST: '/pageable/{employeeId}'
  };

  public static readonly DISCIPLINE_PROCESS = {
    PREFIX: '/discipline-process',
    LIST: '/pageable/{employeeId}'
  };
  public static readonly EVALUATION_RESULTS = {
    PREFIX: '/evaluation-results',
    LIST: '/pageable/{employeeId}'
  };


  public static readonly JOBS = {
    PREFIX: '/jobs',
    GET_ALL: '/jobs/list',
    GET_BY_JOB_TYPE: '/list'
  };
  public static readonly LOG_TASK = {
    PREFIX: '/log-task',
    UPDATE: '/log-task/{id}',
    GET_ALL: '/log-task/list',
    GET_BY_JOB_TYPE: '/list'
  };

  public static readonly POSITIONS = {
    PREFIX: '/positions',
    GET_BY_ORG: '/positions/list'
  };
  public static readonly POSITION_GROUPS = {
    PREFIX: '/position-groups'
  };


  public static readonly EMP_TYPES = {
    PREFIX: '/emp-types',
    GET_LIST: '/emp-types/list'
  };

  public static readonly DYNAMIC_REPORTS = {
    EXPORT: '/export-detail'
  };


  public static readonly DOCUMENT_TYPES = {
    PREFIX: '/document-types',
    GET_LIST: '/document-types/list'
  };

  public static readonly CONTRACT_TYPES = {
    PREFIX: '/contract-types',
    GET_LIST: '/contract-types/list'
  };

  public static readonly SALARY_RANKS = {
    PREFIX: '/salary-ranks',
    GET_LIST: '/salary-ranks/list/{salaryType}',
    GET_BY_LIST_TYPE: '/salary-ranks/by-list-type'
  };

  public static readonly EMPLOYEE_REPORT = {
    PREFIX: '/employee-report'
  };

  public static readonly DOMAIN_DATA = {
    SEARCH: '/domain/search/{type}',
    LOAD_NODE: '/domain/root-nodes/{type}',
    LOAD_BY_PARENT: '/domain/children-nodes/{type}'
  };

  public static readonly WORK_PROCESS = {
    PREFIX: '/work-process',
    LIST: '/pageable/{employeeId}',
    DELETE: '/{employeeId}/{id}'
  };
  public static readonly CONTRACT_PROCESS = {
    PREFIX: '/contract-process',
    LIST: '/pageable/{employeeId}'
  };
  public static readonly INSURANCE_SALARY = {
    PREFIX: '/insurance-salary-process',
    LIST: '/pageable/{employeeId}'
  };

  public static readonly POSITION_SALARY = {
    PREFIX: '/position-salary-process',
    LIST: '/pageable/{employeeId}'
  };

  public static readonly ALLOWANCE_PROCESS = {
    PREFIX: '/allowance-process',
    LIST: '/pageable/{employeeId}'
  };

  public static readonly PLANNING_ASSIGNMENT = {
    LIST: '/pageable/{employeeId}'
  };

  // Quá trình kỷ luật
  public static readonly DISCIPINARY_HISTORY_INFO = {
    PREFIX: '/decpline-records',
    LIST: '/employees/{employeeId}',
    SAVE: '',
    DELETE: '/{decplineRecordId}',
    GET_BY_ID: '/{id}',
    DETAIL: '/{decplineRecordId}'
  };

  public static readonly CATALOGS = {
    PREFIX: '/category/list/{typeCode}',
    CONTRACT_TYPES: '/contract-types',
    JOBS: '/mp-jobs',
    PROJECTS: '/mp-projects',
    SALARY_GRADES: '/salary-grades',
    SALARY_RANKS: '/salary-ranks',
    DOCUMENT_TYPES: '/document-types',
    MB_POSITIONS: '/mp-positions/org/{orgId}',
    CERTIFICATES: '/certificates/all',
    PERIOD: '/category/periods',
    GET_JOB_REQUIRED_AMOUNT_FEE: '/category/adm-config/get-by-key/{configKey}'
  };

  public static readonly SEARCH_FORM = {
    BASIC_FORM: '/employees/basic-information',
    EDUCATION_PROCESS: '/education-process',
    IDENTITY: '/personal-identities',
    INSURANCE_SALARY: '/insurance-salary-process',
    BANK_ACCOUNT: '/bank-accounts',
    ALLOWANCE_HIS: '/allowance-process',
    WORK_PROCESS: '/work-process',
    CONCURRENT_PROCESS: '/concurrent-process',
    FAMILY_RELATIONSHIPS: '/family-relationships',
    DEPENDENT_PERSONS: '/dependent-persons',
    CONTRACT_PROCESS: '/contract-process',
    EDUCATION_DEGREES: '/education-degrees',
    DISCIPLINE: '/discipline-process',
    AWARD_PROCESS: '/award-process',
    WORKED_HIS: '/worked-histories',
    EDUCATION_CERTIFICATES: '/education-certificates',
    EVALUATION_RESULTS: '/evaluation-results',
    POSITION_SALARY_PROCESS: '/position-salary-process',
    EDUCATION_PROMOTIONS: '/education-promotions',
    POLITICAL_PARTICIPATIONS: '/political-participations',
    PLANNING_ASSIGNMENTS: '/planning-assignments'
  };

  public static readonly EMPLOYEE = {
    IMPORT: '/employees/import',
    IMPORT_TEMPLATE: '/employees/import-template'
  };

  public static readonly FAMILY_RELATIONSHIPS = {
    IMPORT: '/family-relationships/import',
    DOWNLOAD_TEMPLATE: '/family-relationships/download-template'
  };

  public static readonly EXPORT_REPORT = {
    EMPLOYEES: '/employees/export'
  };

  public static readonly USER_BOOKMARK = {
    PREFIX: '/user-bookmarks',
    DELETE_BOOKMARK: '/user-bookmarks/{id}',
    GET_BY_USER: '/user-bookmarks/by-user'
  };

}
