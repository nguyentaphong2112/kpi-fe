export class Constant {
  public static readonly FUNCTION_CODE = {
    CRM_PARTNERS: 'CRM_PARTNERS',
    CRM_PRODUCTS: 'CRM_PRODUCTS',
    CRM_CUSTOMERS: 'CRM_CUSTOMERS',
    CRM_CUSTOMER_CARE_RECORDS: 'CRM_CUSTOMER_CARE_RECORDS',
    PYTAGO_RESEARCH: 'PYTAGO_RESEARCH',
    CRM_EMPLOYEES: 'CRM_EMPLOYEES',
    CRM_PYTAGO_RESEARCHS: 'CRM_PYTAGO_RESEARCHS',
    CRM_COURSES: 'CRM_COURSES',
    CRM_ORDERS: 'CRM_ORDERS',
    CRM_CUSTOMER_CERTIFICATES: 'CRM_CUSTOMER_CERTIFICATES',
    CRM_ORDER_PAYABLE: 'CRM_ORDER_PAYABLE'
  };

  public static readonly TYPE_LIST = [
    { value: 'NGUOI_LON', label: 'crm.pytagoResearchs.label.adult' },
    { value: 'TRE_EM', label: 'crm.pytagoResearchs.label.child' }
  ];

  public static readonly CUSTOMER_CERTIFICATES = {
    CHO_PHE_DUYET: 'CHO_PHE_DUYET',
    TU_CHOI: 'TU_CHOI',
    PHE_DUYET: 'PHE_DUYET',
    DE_NGHI_XOA: 'DE_NGHI_XOA'
  };

  public static readonly ORDER_PAYABLES = {
    CHO_PHE_DUYET: 'CHO_PHE_DUYET',
    TU_CHOI: 'TU_CHOI_PHE_DUYET',
    PHE_DUYET: 'PHE_DUYET'
  };

  public static readonly LIST_STATUS = [
    { value: 'PHE_DUYET', label: 'crm.customerCertificates.label.yes' },
    { value: 'TU_CHOI', label: 'crm.customerCertificates.label.no' }
  ];

  public static readonly LIST_STATUS2 = [
    { value: 'PHE_DUYET', label: 'crm.customerCertificates.label.yes' },
    { value: 'TU_CHOI_PHE_DUYET', label: 'crm.customerCertificates.label.no' }
  ];

  public static readonly LIST_REPORT_TYPE = [
    { value: 'CRM_DANH_SACH_KHACH_HANG', label: 'crm.export-report.label.customerList' },
    { value: 'CRM_DANH_SACH_DON_HANG', label: 'crm.export-report.label.order' },
    { value: 'CRM_DANH_SACH_THANH_TOAN_THEO_DON_HANG', label: 'crm.export-report.label.orderPayment' },
    { value: 'CRM_DANH_SACH_THANH_TOAN_PHI_THEO_KHACH_HANG', label: 'crm.export-report.label.customerPayment' }
  ];
}