export class UrlConstant {
  public static readonly API_VERSION = '/v1';
  public static readonly GET_EVALUATION_PERIODS = '/evaluation-results/evaluation_periods?evaluationType=2';
  public static readonly INDICATOR = {
    PREFIX: '/indicators',
    DATA_PICKER: '/indicators/data-picker/',
    DATA_PICKER2: '/data-picker',
    GET_LIST: '/list',
    GET_LIST_EMPLOYEE: '/list/employee/'
  };
  public static readonly INDICATOR_CONVERSION = {
    SEARCH_POPUP: '/indicators/search',
    PREFIX: '/indicator-conversions',
    INDICATOR: '/indicators',
    GET_TABLE: '/indicators/get-table',
    ORGANIZATION_LIST: '/indicator-conversions/organization',
    ORGANIZATION_LIST2: '/organization',
    STATUS: '/status',
    GET_ORG_LIST: '/get-org-list/'
  };

  public static readonly INDICATOR_MASTER = {
    PREFIX: '/indicator-masters',
    STATUS: '/status',
    APPROVAL_ALL: '/approval-all'
  };

  public static readonly EVALUATION_PERIODS = {
    PREFIX: '/evaluation-periods',
    MAX_YEAR: '/max-year',
    INIT_DATA: '/init-data/',
    STATUS: '/status'
  };

  public static readonly EMPLOYEES = {
    EXPORT: '/export'
  };

  public static readonly ORGANIZATION_EVALUATION = {
    INDICATOR: '/indicator',
    WORK_PLANNING: '/work-planning',
    STATUS: '/status',
    WORK_PLANNING_TEMPLATE: '/work-planning-templates',
    EXPORT: '/export/',
    EXPORT_EVALUATE: '/export-evaluate/',
    EMP_MANAGER: '/empManager',
    APPROVE: '/approve/',
    REVIEW: '/review/',
    SEND_APPROVE: '/send-for-approval',
    ORG_PARENT: '/org-parent',
    EVALUATE: '/evaluate',
    EVALUATE_MANAGE: '/evaluate-manage',
    LIST: '/work-planning-templates/list',
    INDICATOR_LEVEL1: '/level1/indicator',
    SEND_APPROVE_LEVEL1: '/send-for-approval/level1',
    CONFIRM_LEVEL1: '/confirm/level1'
  };

  public static readonly WORK_PLANNING_TEMPLATE = {
    EXPORT: '/export/'
  };

  public static readonly EMPLOYEE_EVALUATION = {
    INDICATOR: '/indicator',
    WORK_PLANNING: '/work-planning',
    STATUS: '/status',
    EXPORT: '/export/',
    EXPORT_EVALUATE: '/export-evaluate/',
    APPROVE: '/approve/',
    REVIEW: '/review/',
    SEND_APPROVE: '/send-for-approval',
    EVALUATE: '/evaluate',
    EVALUATE_MANAGE: '/evaluate-manage',
    STATUS_APPROVED: '/status-approved'
  };

  public static readonly JOBS = {
    VI_TRI_VIEC_LAM: '/jobs/list?jobType=VI_TRI_VIEC_LAM',
    VI_TRI_VIEC_LAM_SUB: '/list'
  };

  public static readonly CATEGORY = {
    GET_CATEGORIES: '/list/{categoryType}',
    CATEGORY: '/category',
    CATEGORY_TYPE: '/category-type',
    GET_ALL_CATEGORY_TYPE: '/category-type/all'
  };

  public static readonly FEED_BACKS = {
    PREFIX_ADMIN: '/admin/feedbacks',
  }

  public static readonly CARD_TEMPLATES = {
    PREFIX: '/card-templates'
  };

  public static readonly ORGANIZATIONS = {
    LOAD_CHILDREN: '/organization-tree/children-nodes'
  };
}