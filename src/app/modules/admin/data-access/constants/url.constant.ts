export class UrlConstant {
  public static readonly API_VERSION = '/v1';
  public static readonly RESOURCES = {
    GET_RESOURCE: '/resource',
    GET_SCOPE: '/scope/list',
    GET_TREE_RESOURCE: '/resource-tree/init-tree',
    LOCK: '/lock-by-id',
    UN_LOCK: '/unlock-by-id'
  };
  public static readonly USERS = {
    GET_USER: '/user',
    LOCK: '/lock-by-id',
    UN_LOCK: '/unlock-by-id',
    RESET_PASSWORD: '/reset-password'
  };
  public static readonly ROLES = {
    GET_ROLE: '/role',
    GET_TREE_ROLE: '/init-tree-permission',
    GET_TREE_ROLE_BY_ID: '/tree-permission-selected/{id}',
    UPDATE_TREE_ROLE_BY_ID: '/grant-permission/{id}',
    GET_LIST: '/list'
  };
  public static readonly USER_ROLES = {
    GET_USER_ROLE: '/user-role',
    GET_BY_USER_ID: '/{userId}',
    DELETE_BY_USER_ID: '/v1/user-role/{userId}/{roleId}',
    GRANT_DOMAIN: '/grant-domain'
  };

  public static readonly CONFIG_PAGE = {
    PREFIX: '/config-pages',
    CONFIG_URL: '/config-by-url'
  };

  public static readonly CATEGORIES = {
    GET_LIST_CATEGORY: '/list/{categoryType}',
    CATEGORY: '/category',
    CATEGORY_TYPE: '/category-type',
    GET_ALL_CATEGORY_TYPE: '/category-type/all'
  };
  public static readonly DOMAINS = {
    GET_DOMAIN: '/domain',
    GET_DEFAULT_LIST_DOMAIN: '/domain/default-list/{type}',
    GET_LIST_DOMAIN: '/domain/list/{type}',
    GET_ROOT_NODES: '/root-nodes/{type}',
    SEARCH_NODES: '/search/{type}',
    GET_CHILD_NODE: '/children-nodes/{type}/{parentKey}',
    SEARCH: '/domain/search/{type}',
    LOAD_NODE: '/domain/root-nodes/{type}',
    LOAD_BY_PARENT: '/domain/children-nodes/{type}'
  };

  public static readonly ATTRIBUTES = {
    GET_ATTRIBUTES: '/config-object-attribute',
    GET_LIST_TABLE_NAME: '/config-object-attribute/list-table-data'
  };

  public static readonly PARAMETERS = {
    GET_PARAMETERS: '/config-parameter',
    SEARCH_PARAMETERS: '/{configGroup}'
  };

  public static readonly DYNAMIC_REPORTS = {
    PREFIX: '/dynamic-reports',
    EXPORT: '/export-detail',
    DOWNLOAD: '/v1/attachment-file/download/{attachmentId}/{checksum}',
    FILE: '/file'
  };

  public static readonly CONFIGS_PARAMETERS = {
    DEFAULT: '/config-parameter',
    PREFIX: '/config-parameter/{configGroup}',
    SEARCH_PARAMETERS: '/config-parameter/{configGroup}/{id}',
    BY_ID: '/config-parameter/{id}',
    EXPORT: '/config-parameter/export',
    GET_PARAMETER: '/parameter'
  };
}
