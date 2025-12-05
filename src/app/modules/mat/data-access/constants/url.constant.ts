export class UrlConstant {
  public static readonly API_VERSION = '/v1';
  public static readonly GET_EVALUATION_PERIODS = '/evaluation-results/evaluation_periods';
  public static readonly INDICATOR = {
    PREFIX: '/indicators',
    DATA_PICKER: '/indicators/data-picker',
    DATA_PICKER2: '/data-picker',
    GET_LIST: '/list',
    GET_LIST_EMPLOYEE: '/list/employee/'
  };
  public static readonly INDICATOR_CONVERSION = {
    SEARCH_POPUP: '/indicators/search',
    PREFIX: '/indicator-conversions',
    INDICATOR: '/indicators',
    ORGANIZATION_LIST: '/indicator-conversions/organization',
    ORGANIZATION_LIST2: '/organization'
  };

  public static readonly EVALUATION_PERIODS = {
    PREFIX: '/evaluation-periods',
    MAX_YEAR: '/max-year'
  };

  public static readonly ORGANIZATION_EVALUATION = {
    INDICATOR: '/indicator',
    WORK_PLANNING: '/work-planning',
    STATUS: '/status',
    WORK_PLANNING_TEMPLATE: '/work-planning-templates',
    EXPORT: '/export/'
  };

  public static readonly EMPLOYEE_EVALUATION = {
    INDICATOR: '/indicator',
    WORK_PLANNING: '/work-planning',
    STATUS: '/status',
    EXPORT: '/export/'
  };

  public static readonly JOBS = {
    VI_TRI_VIEC_LAM: '/jobs/list?jobType=VI_TRI_VIEC_LAM',
    VI_TRI_VIEC_LAM_SUB: '/list?jobType=VI_TRI_VIEC_LAM'
  };

  public static readonly CATEGORY = {
    GET_CATEGORIES: '/list/{categoryType}',
    CATEGORY: '/category',
    CATEGORY_TYPE: '/category-type',
    GET_ALL_CATEGORY_TYPE: '/category-type/all'
  };

  public static readonly CARD_TEMPLATES = {
    PREFIX: '/card-templates'
  };

}