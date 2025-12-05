export class Constant {
  public static readonly FUNCTION_CODE = {
    KPI_INDICATOR: 'INDICATOR',
    INDICATOR_CONVERSION: 'INDICATOR_CONVERSION',
    WORK_PLANNING_TEMPLATE: 'WORK_PLANNING_TEMPLATE',
    ORGANIZATION_EVALUATION: 'ORGANIZATION_EVALUATION',
    EMPLOYEE_EVALUATIONS: 'EMPLOYEE_EVALUATIONS',
    EVALUATION_PERIODS: 'EVALUATION_PERIODS',
    PERSONAL_EVALUATIONS: 'PERSONAL_EVALUATIONS',
    ORGANIZATION_EVALUATE: 'ORGANIZATION_EVALUATE',
    EMPLOYEE_EVALUATE: 'EMPLOYEE_EVALUATE',
    PERSONAL_EVALUATE: 'PERSONAL_EVALUATE',
    EMPLOYEE_SUMMARY: 'EMPLOYEE_KPI_SUMARY',
    ORGANIZATION_SUMMARY: 'ORGANIZATION_SUMMARY',
    ORGANIZATION_AGGREGATE_DATA: 'ORGANIZATION_AGGREGATE_DATA',
    KPI_ORG_CONFIGS: 'KPI_ORG_CONFIGS',
    ORGANIZATION_PROVIDE_LEVEL1: 'ORGANIZATION_PROVIDE_LEVEL1'
  };

  public static readonly CATEGORY = {
    KPI_DON_VI_TINH: 'KPI_DON_VI_TINH',
    INDICATOR_CONVERSION_STATUS: 'INDICATOR_CONVERSION_STATUS',
    KPI_EMPLOYEE_EVALUATION_STATUS: 'KPI_EMPLOYEE_EVALUATION_STATUS',
    KPI_ORGANIZATION_EVALUATION_STATUS: 'KPI_ORGANIZATION_EVALUATION_STATUS',
    EVALUATION_PERIODS_STATUS: 'EVALUATION_PERIODS_STATUS',
    KPI_LEVEL_COMPLETE: 'KPI_LEVEL_COMPLETE'
  };

  public static readonly STATUS = {
    PHE_DUYET: 'PHE_DUYET',
    CHOT_KQ_DANH_GIA: 'CHOT_KQ_DANH_GIA',
    CHO_PHE_DUYET: 'CHO_PHE_DUYET',
    TU_CHOI_PHE_DUYET: 'TU_CHOI_PHE_DUYET',
    TU_CHOI_XET_DUYET: 'TU_CHOI_XET_DUYET',
    DANH_GIA: 'DANH_GIA',
    CHO_QLTT_DANH_GIA: 'CHO_QLTT_DANH_GIA',
    DU_THAO: 'DU_THAO',
    CHO_XET_DUYET: 'CHO_XET_DUYET',
    XET_DUYET: 'XET_DUYET',
    KHOI_TAO: 'KHOI_TAO',
    LAP_DANH_SACH: 'LAP_DANH_SACH',
    CHOT_DU_LIEU1: 'CHOT_DU_LIEU1',
    CHOT_DU_LIEU2: 'CHOT_DU_LIEU2',
    CHOT_KET_QUA: 'CHOT_KET_QUA',
    DE_NGHI_XOA: 'DE_NGHI_XOA',
    HET_HIEU_LUC: 'HET_HIEU_LUC',
    HIEU_LUC_LAI: 'HIEU_LUC_LAI',
    CHO_PHE_DUYET_HIEU_LUC_LAI: 'CHO_PHE_DUYET_HIEU_LUC_LAI',
    QLTT_DANH_GIA: 'QLTT_DANH_GIA',
    YC_DANH_GIA_LAI: 'YC_DANH_GIA_LAI',
    YC_NHAP_LAI: 'YC_NHAP_LAI',
    DA_XAC_NHAN_KQ_DANH_GIA: 'DA_XAC_NHAN_KQ_DANH_GIA',
    CHO_QLTT_DANH_GIA_LAI: 'CHO_QLTT_DANH_GIA_LAI',
    YEU_CAU_NHAP_LAI: 'YEU_CAU_NHAP_LAI',
    XAC_NHAN: 'XAC_NHAN',
    CHO_XAC_NHAN: 'CHO_XAC_NHAN'
  };

  public static readonly INDICATOR_CONVERSION_STATUS = {
    CHO_PHE_DUYET: 'CHO_PHE_DUYET',
    TU_CHOI_PHE_DUYET: 'TU_CHOI_PHE_DUYET',
    PHE_DUYET: 'PHE_DUYET',
    DE_NGHI_XOA: 'DE_NGHI_XOA',
    HET_HIEU_LUC: 'HET_HIEU_LUC',
    HIEU_LUC_LAI: 'HIEU_LUC_LAI',
    CHO_PHE_DUYET_HIEU_LUC_LAI: 'CHO_PHE_DUYET_HIEU_LUC_LAI'
  };

  public static readonly KPI_EMPLOYEE_EVALUATION_STATUS = {
    DU_THAO: 'DU_THAO',
    CHO_PHE_DUYET: 'CHO_PHE_DUYET',
    TU_CHOI_PHE_DUYET: 'TU_CHOI_PHE_DUYET',
    PHE_DUYET: 'PHE_DUYET',
    KHOI_TAO: 'KHOI_TAO',
    DANH_GIA: 'DANH_GIA',
    CHO_XET_DUYET: 'CHO_XET_DUYET',
    XET_DUYET: 'XET_DUYET',
    TU_CHOI_XET_DUYET: 'TU_CHOI_XET_DUYET',
    QLTT_DANH_GIA: 'QLTT_DANH_GIA',
    CHO_QLTT_DANH_GIA: 'CHO_QLTT_DANH_GIA',
    YC_DANH_GIA_LAI: 'YC_DANH_GIA_LAI',
    YC_NHAP_LAI: 'YC_NHAP_LAI'
  };


  public static readonly KPI_ORGANIZATION_EVALUATION_STATUS = {
    DU_THAO: 'DU_THAO',
    CHO_PHE_DUYET: 'CHO_PHE_DUYET',
    TU_CHOI_PHE_DUYET: 'TU_CHOI_PHE_DUYET',
    PHE_DUYET: 'PHE_DUYET',
    XAC_NHAN: 'XAC_NHAN',
    KHOI_TAO: 'KHOI_TAO',
    DANH_GIA: 'DANH_GIA',
    CHO_XET_DUYET: 'CHO_XET_DUYET',
    XET_DUYET: 'XET_DUYET',
    TU_CHOI_XET_DUYET: 'TU_CHOI_XET_DUYET',
    QLTT_DANH_GIA: 'QLTT_DANH_GIA',
    CHO_QLTT_DANH_GIA: 'CHO_QLTT_DANH_GIA',
    YC_DANH_GIA_LAI: 'YC_DANH_GIA_LAI',
    YC_NHAP_LAI: 'YC_NHAP_LAI'
  };

  public static readonly LIST_SIGN = [
    { value: 'GREATER_THAN_EQUAL', label: '>=' },
    { value: 'GREATER_THAN', label: '>' },
    { value: 'EQUAL', label: '=' },
    { value: 'LESS_THAN_EQUAL', label: '<=' },
    { value: 'LESS_THAN', label: '<' }
  ];
  public static readonly LIST_SIGN_MAX = [
    { value: 'GREATER_THAN_EQUAL', label: '>=' },
    { value: 'GREATER_THAN', label: '>' },
    { value: 'EQUAL', label: '=' }
  ];
  public static readonly LIST_SIGN_MIN = [
    { value: 'LESS_THAN_EQUAL', label: '<=' },
    { value: 'LESS_THAN', label: '<' },
    { value: 'EQUAL', label: '=' }
  ];

  public static readonly LIST_REQUIRED = [
    { value: 'Y', label: 'kpi.indicatorConversions.label.yes' },
    { value: 'N', label: 'kpi.indicatorConversions.label.no' }
  ];

  public static readonly CONVERSION_VALUE = [
    { value: 'CA_NHAN', label: 'kpi.indicatorConversions.label.isNumber' },
    { value: 'DON_VI', label: 'kpi.indicatorConversions.label.isValue' }
  ];


  public static readonly CONVERSION_VALUE2 = [
    { value: 'EMP', label: 'kpi.indicatorConversions.label.isIdentity' },
    { value: 'ORG', label: 'kpi.indicatorConversions.label.isOrg' }
  ];

  public static readonly LEVEL_VALUE = [
    { value: 1, label: 'kpi.indicatorConversions.label.level1' },
    { value: 2, label: 'kpi.indicatorConversions.label.level2' },
    { value: 3, label: 'kpi.indicatorConversions.label.level3' },
    { value: 4, label: 'kpi.indicatorConversions.label.level4' }
  ];
}
