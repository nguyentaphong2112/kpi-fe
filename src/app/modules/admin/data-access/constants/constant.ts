export class Constant {
  public static readonly RESOURCE_STATUS = [
    { value: 'ACTIVE', label: 'admin.permissions.resources.label.unlock', color: '#06A561', bgColor: '#DAF9EC' },
    { value: 'INACTIVE', label: 'admin.permissions.resources.label.lock', color: '#FA0B0B', bgColor: '#FFC9C9' }
  ];
  public static readonly RESOURCE_USED_STATUS = [
    { value: 'Y', label: 'admin.permissions.resources.label.used', color: '#06A561', bgColor: '#DAF9EC' },
    { value: 'N', label: 'admin.permissions.resources.label.notUsed', color: '#FA0B0B', bgColor: '#FFC9C9' }
  ];
  public static readonly LIST_CONFIRM = [
    { value: 'Y', label: 'admin.permissions.resources.label.yes' },
    { value: 'N', label: 'admin.permissions.resources.label.no' }
  ];
  public static readonly CATEGORY = {
    DEFAULT: 'SYS_LOAI_PHAN_QUYEN_MAC_DINH',
    GET_ATTRIBUTES: 'sys_loai_mien_du_lieu'
  };
  public static readonly LIST_REQUIRED = [
    { value: true, label: 'admin.permissions.resources.label.yes' },
    { value: false, label: 'admin.permissions.resources.label.no' }
  ];

  public static readonly LIST_REPORT_TYPE = [
    { value: 'EXCEL', label: 'admin.configurations.dynamicReports.label.excel' },
    { value: 'DOC', label: 'admin.configurations.dynamicReports.label.doc' },
    { value: 'PDF', label: 'admin.configurations.dynamicReports.label.pdf' }
  ];

  public static readonly LIST_DATA_TYPE = [
    { value: 'STRING', label: 'admin.configurations.dynamicReports.label.string' },
    { value: 'DATE', label: 'admin.configurations.dynamicReports.label.date' },
    { value: 'LONG', label: 'admin.configurations.dynamicReports.label.long' },
    { value: 'DOUBLE', label: 'admin.configurations.dynamicReports.label.double' },
    { value: 'LIST', label: 'admin.configurations.dynamicReports.label.list' },
    { value: 'MULTI_LIST', label: 'admin.configurations.dynamicReports.label.manyList' },
    { value: 'EMP', label: 'admin.configurations.dynamicReports.label.staff' },
    { value: 'ORG', label: 'admin.configurations.dynamicReports.label.unit' },
    { value: 'MULTI_ORG', label: 'admin.configurations.dynamicReports.label.manyUnit' }
  ];

  public static readonly LIST_TYPE = [
    { value: 'string', label: 'admin.configurations.attributes.label.string' },
    { value: 'long', label: 'admin.configurations.attributes.label.long' },
    { value: 'double', label: 'admin.configurations.attributes.label.double' },
    { value: 'date', label: 'admin.configurations.attributes.label.date' },
    { value: 'list', label: 'admin.configurations.attributes.label.list' },
    { value: 'multi_list', label: 'admin.configurations.attributes.label.multiList' },
    { value: 'text', label: 'admin.configurations.attributes.label.textArea' }
  ];

  public static readonly LIST_PERIOD_TYPE = [
    { value: 'DATE', label: 'admin.configurations.parameters.label.date' },
    { value: 'MONTH', label: 'admin.configurations.parameters.label.month' },
    { value: 'ONLY_MONTH', label: 'admin.configurations.parameters.label.onlyMonth' }
  ];

  public static readonly LIST_SERVICE = [
    { value: 'ADMIN', label: 'ADMIN' },
    { value: 'LIBRARY', label: 'LIBRARY' },
    { value: 'HRM', label: 'HRM' },
    { value: 'KPI', label: 'KPI' },
    { value: 'ABS', label: 'ABS' },
    { value: 'CRM', label: 'CRM' },
    { value: 'MED', label: 'MED' },
    { value: 'LMS', label: 'LMS' }
  ];

  public static readonly LIST_CONFIG_PAGE_TYPE = [
    { value: 'REPORT_TEMPLATE', label: 'admin.configPages.label.reportTemplate' },
    { value: 'USER_GUIDE', label: 'admin.configPages.label.userGuide' },
  ];



}
