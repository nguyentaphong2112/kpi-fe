export class UrlConstant {
  public static readonly DOWNLOAD_FILE_ERROR = '/v1/download/temp-file';
  public static readonly API_VERSION = '/v1';

  public static readonly GET_EMP_TYPE = '/emp-types/list';
  public static readonly GET_REASON_TYPE = '/reason-types/list'
  public static readonly GET_JOBS = '/jobs/list';
  public static readonly GET_ATTRIBUTE_CONFIG = '/config-object-attribute/get-by-table-name';
  public static readonly GET_CATEGORIES = '/category/list/{typeCode}';

  public static readonly DOMAINS = {
    SEARCH: '/domain/search/{type}',
    LOAD_NODE: '/domain/root-nodes/{type}',
    LOAD_BY_PARENT: '/domain/children-nodes/{type}'
  };

  public static readonly CATEGORIES = {
    CATEGORY: '/category',
    GET_LIST: '/category/list',
    CATEGORY_TYPE_BY_CODE: '/category-type/get-by-code/{code}'
  };

  public static readonly ORGANIZATIONS = {
    SEARCH: '/organization-tree/search',
    LOAD_NODE: '/organization-tree/root-nodes',
    LOAD_CHILDREN: '/organization-tree/children-nodes',
    GET_BY_LIST_ID: '/organization-tree/by-list-id'
  };

  public static readonly INFO_CHANGE = {
    GET_INFO_CHANGE: '/employees/{employeeId}/info-changes',
  };

  public static readonly CATALOGS = {
    PREFIX: '/lookup-values',
    CONTRACT_TYPES: '/contract-types',
    JOBS: '/mp-jobs',
    PROJECTS: '/mp-projects',
    SALARY_GRADES: '/salary-grades',
    SALARY_RANKS: '/salary-ranks',
    DOCUMENT_TYPES: '/document-types',
    MB_POSITIONS: '/mp-positions/org/{orgId}'
  };

  public static readonly EMPLOYEES = {
    PREFIX: '/employees',
    DATA_PICKER: '/data-picker',
    PERSONAL_INFO: '/personal-information',
    IDENTITIES: '/identities',
    CONTACT: '/contact-info',
    BANK: '/bank-accounts',
    PARTY: '/party-army',
    AVATAR: '/avatar',
    BASIC_INFO: '/basic-information',
    PERSONAL: '/personal',
    LIST: '/list'
  };


  public static readonly CUSTOMERS = {
    PREFIX: '/customers',
    LIST: '/list',
    CARE: '/care'
  };
  public static readonly PYTAGO_RESEARCH = {
    CREATE_CUSTOMER: '/create-customer/'
  };
  public static readonly PARTNERS = {
    PREFIX: '/partners',
    LIST: '/list',
    EXPORT_CARD: '/v1/card-objects/export-card',
    GET_CARD_OBJECT: '/v1/card-objects/list'
  };

  public static readonly CARD_TEMPLATES = {
    PREFIX: '/card-templates', // Đường dẫn cơ sở cho các mẫu thẻ
    BY_TEMPLATE_TYPE: '/by-template-type', // Đường dẫn cho loại mẫu thẻ
    TITLE: '/title',
    FILE: '/file'
  };

}
