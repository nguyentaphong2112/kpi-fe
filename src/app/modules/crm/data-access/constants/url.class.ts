export class UrlConstant {
  public static readonly API_VERSION = '/v1';


  public static readonly CATEGORY_ADDRESS = {
    GET_DISTRICT: '/district/list',
    GET_WARDS: '/ward/list'
  };

  public static readonly CATEGORY = {
    GET_BY_PARENT: '/category/list-by-parent/{categoryType}',
    GET_LIST_FAMILY: '/category/list/THANH_PHAN_GIA_DINH',
    GET_LIST_SELF: '/category/list/THANH_PHAN_BAN_THAN',
    GET_LIST_GROUP_TYPE: '/category/list/GROUP_NHOM_CHUC_DANH',
    GET_CATEGORIES: '/list/{typeCode}'
  };
  public static readonly TRAINING_PROGRAM = {
    GET_LIST: '/training-programs/list'
  };
  public static readonly CUSTOMER = {
    GET_LIST: '/list',
    GET_LIST_SEARCH: '/customers/list',
    COURSE: '/course'
  };

  public static readonly ORDER_PAYABLES = {
    MAKE_LIST: '/make-list',
    STATUS: '/status/',
    APPROVE_ALL: '/approve-all',
    UNDO_APPROVE: '/undoApprove'
  };

  public static readonly COURSES = {
    GET_USER_LIST: '/user-list',
    GET_COURSE_LIST: '/course-list',
    SAVE_LESSON_RESULT: '/lesson-result',
    GET_USER_LIST_SEARCH: '/courses/user-list'
  };

  public static readonly COURSE_LESSONS = {
    GET_BY_COURSE: '/course',
    GET_BY_COURSE_LIST: '/course-list'
  };

  public static readonly CUSTOMER_CERTIFICATES = {
    STATUS: '/status/',
  };

  public static readonly EXPORT_REPORT = {
    PREFIX: '/export-report'
  };


}
