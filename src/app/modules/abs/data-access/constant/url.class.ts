export class UrlConstant {
  public static readonly API_VERSION = '/v1';
  public static readonly GET_REASON_TYPE = '/reason-types/list'

  public static readonly REASON_LEAVE = {
    PREFIX: '/reason-leaves',
    DELETE: '/{reasonLeaveId}',
    DETAIL: '/{reasonLeaveId}'
  };

  public static readonly REASON_TYPES = {
    LIST:'/reason-types/all'
  };
  public static readonly WORK_CALENDAR = {
    PREFIX: '/work-calendars',
    DELETE: '/{workCalendarId}',
    DETAIL: '/{workCalendarId}',
    ALL_ACTIVE: '/get-all-active',
    ASSIGN: '/{workCalendarId}/assign'
  };
  public static readonly WORK_CALENDAR_DETAIL = {
    PREFIX: '/work-calendar-details',
    DELETE: '/{workCalendarDetailId}',
    DETAIL: '/{workCalendarDetailId}'
  };
  public static readonly WORKDAY_TYPE = {
    PREFIX: '/workday-types',
    DELETE: '/{workdayTypeId}',
    DETAIL: '/{workdayTypeId}'
  };
  public static readonly APPROVAL_FLOW = {
    PREFIX: '/approval-flow',
    SAVE: '',
    LEVEL_NV: '/mp-position-groups/RANKING',
    REASONS: '/reason-leaves/LEAVE/all',
    DELETE: '/{approvalFlowId}',
    DETAIL: '/{approvalFlowId}',
    SEARCH: '/search',
    position_groups: '/position_groups/'
  };

  public static readonly SEARCH_FORM = {
    ANNUAL_LEAVES: '/annual-leaves/search',
    ANNUAL_LEAVES_CALCULATE: '/annual-leaves/calculate',
    POS_ANNUAL_LEAVES: '/pos-annual-leaves/search',
    LOOKUP_EMP_TYPE: '/lookup-values?typeCode=DOI_TUONG_CV',
    LOOKUP_POSITION_GROUP: '/mp-position-groups/BASE',
    POSITION_GROUP_ALL: '/mp-position-groups/get-all',
    WORKDAY_TYPE: '/workday-type',
    TIMEKEEPING: '/time-keeping',
    TIMEKEEPING_AUTO: '/time-keeping/auto-set-timekeeping',
    EXPORT_AT_TIME: '/time-keeping/export-at-time',
    EXPORT_CHANGED: '/time-keeping/export-changed',
    REQUEST :'/requests',
  };

  public static readonly DUTY_SCHEDULES = {
    LIST_WEEKS: '/list-week',
    LIST_ORG: '/list-org',
    LIST_DATA: '/list-data',
    COPY_DATA: '/copy-data'
  }

  public static readonly SAVE = {
    POS_ANNUAL_LEAVES: '/pos-annual-leaves',
  };

  public static readonly GET = {
    POS_ANNUAL_LEAVES: '/pos-annual-leaves/',
  };

  public static readonly DELETE = {
    POS_ANNUAL_LEAVES: '/pos-annual-leaves/',
    WORKDAY_TYPE: '/workday-type/{id}'
  };

  public static readonly EXPORT_REPORT = {
    ANNUAL_LEAVES: '/annual-leaves/export',
    POS_ANNUAL_LEAVES: '/pos-annual-leaves/export',
    TIMEKEEPING: '/time-keepings/export',
    REQUEST :'/requests/export'
  };

  public static readonly ATTENDANCE_HISTORIES = {
    STATUS: '/status/'
  };

  public static readonly REQUEST_PATH = '/requests';
  public static readonly APPROVE_BY_LIST = '/approve-by-list'
  public static readonly APPROVE_ALL = '/approve-all'
  public static readonly REQUEST_LEAVE_PATH = '/request-leaves';

  public static readonly CATALOGS = {
    PREFIX: '/lookup-values'
  }

  public static readonly CATEGORY = {
    GET_CATEGORIES: '/list/{categoryType}',
    CATEGORY: '/category',
    CATEGORY_TYPE: '/category-type',
    GET_ALL_CATEGORY_TYPE: '/category-type/all'
  };

}
