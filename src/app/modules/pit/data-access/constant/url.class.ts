export class UrlConstant {
  public static readonly API_VERSION = '/v1';
  public static readonly GET_REASON_TYPE = '/reason-types/list'

  public static readonly TAX_DECLARE_MASTERS = {
    PREFIX: '/work-calendars',
    DELETE: '/{id}',
    DETAIL: '/{id}',
    ALL_ACTIVE: '/get-all-active',
    UN_LOCK: '/unlock',
    LOCK: '/lock',
    EXPORT_TAX_ALLOCATION: '/export-tax-allocation/{id}',
    EXPORT_XML: '/export-xml/{id}',
    EXPORT_DETAIL: '/export/{id}',
    CALCULATE: '/calculate'
  };

  public static readonly INCOME_ITEM_MASTERS = {
    PREFIX: '/work-calendars',
    DELETE: '/{id}',
    DETAIL: '/{id}',
    ALL_ACTIVE: '/get-all-active',
    UN_LOCK: '/unlock',
    LOCK: '/lock',
    GET_DATA_BY_PERIOD: '/get-data-by-period'
  };

  public static readonly INCOME_ITEM = {
    PREFIX: '/work-calendars',
    DELETE: '/{id}',
    DETAIL: '/{id}',
    ALL_ACTIVE: '/get-all-active',
    UN_LOCK: '/unlock/{id}',
    LOCK: '/lock/{id}',
    GET_DATA_BY_PERIOD: '/get-data-by-period'
  };

  public static readonly TAX_SETTLEMENT_MASTERS = {
    PREFIX: '/work-calendars',
    DELETE: '/{id}',
    DETAIL: '/{id}',
    ALL_ACTIVE: '/get-all-active',
    UN_LOCK: '/unlock',
    LOCK: '/lock',
    EXPORT_MONTH: '/export-month/{id}',
    EXPORT_GROUP: '/export-group/{id}',
    EXPORT_DETAIL: '/export/{id}',
  };

  public static readonly CATEGORY = {
    GET_CATEGORIES: '/list/{categoryType}',
    CATEGORY: '/category',
    CATEGORY_TYPE: '/category-type',
    GET_ALL_CATEGORY_TYPE: '/category-type/all'
  };

  public static readonly TAX_REPORT = {
    DETAIL: '/detail/',
  };

  public static readonly CATALOGS = {
    PREFIX: '/lookup-values'
  }

}
