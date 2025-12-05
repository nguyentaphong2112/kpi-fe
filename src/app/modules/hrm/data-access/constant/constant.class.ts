import { environment } from '@env/environment';
import { LookupValues } from '@shared/data-access';
import { _variable } from '@core/global-style/_variable';

export class Constant {
  public static readonly SALARY_ACCOUNT_CODE = '01';
  public static readonly CERTIFICATE_TYPE_CODE = '0';
  public static readonly OTHER_CERTIFICATE_NAME = 'Khác';
  public static readonly PERIOD_CODE_REQUIRED = '01';

  public static readonly DOMAIN_TYPE = {
    DON_VI: 'DON_VI'
  };

  public static readonly ADDRESS_TYPES = {
    THUONG_TRU: 'THUONG_TRU',
    HIEN_TAI: 'HIEN_TAI'
  };

  public static readonly PAPERS_CODE = { CITIZEN_ID: '1', ID_NO: '2', HC: '3' };

  public static readonly MODULE_NAME = {
    BASIC_RESEARCH: 'THONG_TIN_CO_BAN',
    IDENTITY: 'DINH_DANH',
    FAMILY_RELATIONSHIPS: 'THAN_NHAN',
    WORK_OUT: 'QUA_TRINH_CONG_TAC_NGOAI',
    ALLOWANCE: 'PHU_CAP',
    AWARD: 'KHEN_THUONG',
    CONCURRENT_PROCESS: 'QUA_TRINH_KIEM_NHIEM',
    CONTRACT: 'HOP_DONG',
    EDUCATION_DEGREE: 'BANG_CAP',
    EDUCATION_CERTIFICATE: 'CHUNG_CHI',
    EDUCATION_PROCESS: 'QUA_TRINH_DAO_TAO',
    WORK_PROCESS: 'QUA_TRINH_CONG_TAC',
    DISCIPLINE: 'KY_LUAT',
    INSURANCE_SALARY: 'DIEN_BIEN_LUONG',
    BANK_ACCOUNT: 'THONG_TIN_TAI_KHOAN',
    POSITION_SALARY_PROCESS: 'QUA_TRINH_LUONG_TRUONG',
    EDUCATION_PROMOTIONS: 'THONG_TIN_HOC_HAM',
    EVALUATION_RESULTS: 'QUA_TRINH_DANH_GIA',
    POLITICAL_PARTICIPATIONS: 'QUA_TRINH_THAM_GIA',
    PLANNING_ASSIGNMENTS: 'THONG_TIN_QUY_HOACH'
  };

  public static readonly LIST_FLAG_STATUS = [
    { value: 0, label: 'modelPlan.label.expire' },
    { value: 1, label: 'modelPlan.label.effect' }
  ];

  public static readonly LIST_FORCE_UPDATE = [
    { value: true, label: 'hrm.staffManager.insuranceSalaryProcess.label.yes' },
    { value: false, label: 'hrm.staffManager.insuranceSalaryProcess.label.no' }
  ];

  public static readonly SALARY_REVIEWS = [
    { value: 'OK', label: 'hrm.salaryManager.salaryReviews.label.ok' },
    { value: 'NOT_OK', label: 'hrm.salaryManager.salaryReviews.label.notOk' }
  ];

  public static readonly SALARY_REVIEW_STATUS = [
    { value: 'DU_THAO', label: 'hrm.salaryManager.salaryReviews.label.draft', color: _variable.$purple_700, backgroud: _variable.$purple_100 },
    { value: 'CHO_PHE_DUYET', label: 'hrm.salaryManager.salaryReviews.label.awaitApprove', color: _variable.$orange_500, backgroud: _variable.$orange_100 },
    { value: 'DA_PHE_DUYET', label: 'hrm.salaryManager.salaryReviews.label.approved', color: _variable.$success_500, backgroud: _variable.$success_100 },
    { value: 'DA_KY', label: 'hrm.salaryManager.salaryReviews.label.signed', color: _variable.$success_500, backgroud: _variable.$success_100 }
  ];

  public static readonly LIST_REPORT_TYPE = [
    { value: 'DANH_SACH_NHAN_SU', label: 'hrm.staffManager.exportReport.label.empList' },
    { value: 'DANH_SACH_NHAN_SU_DAY_DU', label: 'hrm.staffManager.exportReport.label.empListFullInfo' },
    { value: 'DANH_SACH_TANG_MOI', label: 'hrm.staffManager.exportReport.label.increaseList' },
    { value: 'DANH_SACH_TUYEN_DUNG', label: 'hrm.staffManager.exportReport.label.recruitedList' },
    { value: 'DANH_SACH_GIAM', label: 'hrm.staffManager.exportReport.label.reducedList' },
    { value: 'CO_CAU_LAO_DONG', label: 'hrm.staffManager.exportReport.label.laborStructure' },
    { value: 'DANH_SACH_CHUA_CAP_NHAT', label: 'hrm.staffManager.exportReport.label.notConfirm' },
    { value: 'DANH_SACH_NGHI_HUU', label: 'hrm.staffManager.exportReport.label.retire' },
    { value: 'DS_TRINH_DO_CHUYEN_MON', label: 'hrm.staffManager.exportReport.label.majorLevel' },
    { value: 'DS_QUA_TRINH_LUONG_CHUC_DANH', label: 'hrm.staffManager.exportReport.label.positionSalary' }
  ];

  public static readonly LIST_REPORT_PERIOD = [
    { value: 'MONTH', label: 'hrm.staffManager.exportReport.label.month' },
    { value: 'PERIOD', label: 'hrm.staffManager.exportReport.label.reportPeriod' }
  ];

  public static readonly JOB_TYPE_ADD_POSITION = ['CHUC_VU', 'CONG_VIEC', 'VI_TRI_VIEC_LAM'];

  public static readonly LIST_YES_NO = [
    { value: '0', label: 'modelPlan.label.no' },
    { value: '1', label: 'modelPlan.label.yes' }
  ];

  public static readonly CERT_TYPE_OTHER: LookupValues = {
    value: 'CERT_TYPE_OTHER',
    label: 'Khác',
    id: undefined
  };

  public static readonly CATALOGS = {
    GIOI_TINH: 'GIOI_TINH',
    DAN_TOC: 'DAN_TOC',
    TON_GIAO: 'TON_GIAO',
    TINH_TRANG_HON_NHAN: 'TINH_TRANG_HON_NHAN',
    TINH: 'TINH',
    HUYEN: 'HUYEN',
    XA: 'XA',
    LOAI_HINH_DON_VI: 'HR_LOAI_HINH_DON_VI',
    HINH_THUC_THANH_LAP: 'HR_HINH_THUC_THANH_LAP',
    LOAI_TAI_KHOAN: 'LOAI_TAI_KHOAN',
    LOAI_GIAY_TO: 'LOAI_GIAY_TO',
    MA_VUNG_DIEN_THOAI: 'MA_VUNG_DIEN_THOAI',
    QUOC_GIA: 'QUOC_GIA',
    DOI_TUONG_CV: 'DOI_TUONG_CV',
    CAP_BAC_QUAN_HAM: 'CAP_BAC_QUAN_HAM',
    LEVEL_NV: 'LEVEL_NV',
    PHAN_LOAI_HOP_DONG: 'PHAN_LOAI_HOP_DONG',
    LOAI_HINH_DT: 'LOAI_HINH_DT',
    LOAI_BANG_CAP: 'LOAI_BANG_CAP',
    LOAI_CHUNG_CHI: 'LOAI_CHUNG_CHI',
    CHUNG_CHI: 'CHUNG_CHI',
    HE_DT: 'HE_DT',
    HINHTHUC_DAOTAO: 'HINHTHUC_DAOTAO',
    XEP_LOAI_DT: 'XEP_LOAI_DT',
    XEP_LOAI_TOT_NGHIEP: 'XEP_LOAI_TN',
    MOI_QUAN_HE_NT: 'MOI_QUAN_HE_NT',
    TINH_TRANG_NT: 'TINH_TRANG_NT',
    DOITUONG_CHINHSACH: 'DOI_TUONG_CHINH_SACH',
    CAP_QD_KHENTHUONG: 'CAP_QD_KHENTHUONG',
    HINHTHUC_KHENTHUONG: 'HINHTHUC_KHENTHUONG',
    LOAI_KHENTHUONG: 'LOAI_KHENTHUONG',
    HINHTHUC_KYLUAT: 'HINHTHUC_KYLUAT',
    LOAI_HO_SO: 'LOAI_HO_SO',
    LOAI_PHU_CAP: 'LOAI_PHU_CAP',
    CAP_QD_KYLUAT: 'CAP_QD_KYLUAT',
    NOI_CAP_CCCD: 'NOI_CAP_CCCD',
    NOI_CAP_CMND: 'NOI_CAP_CMND'
  };

  public static readonly FUNCTION_CODE = {
    CTRI_XAHOI: 'CTRI_XAHOI'
  };


  public static readonly CONTRACT_TYPE_CODE = {
    HOP_DONG: 'HD',
    PHU_HOP_DONG: 'PHD',
    PHU_LUC_TAM_HOAN: 'PLTH'
  };

  public static readonly TYPE_CODE = {
    DOI_TUONG_CV: 'DOI_TUONG_CV',
    KHU_VUC: 'KHU_VUC',
    LINE: 'LINE',
    POSITION: 'POSITION',
    LOAI_CHUNG_CHI: 'LOAI_CHUNG_CHI'
  };

  public static readonly SALARY_TYPES = {
    HUONG_LUONG: 'HUONG_LUONG',
    CHUC_VU: 'CHUC_VU',
    CONG_VIEC: 'CONG_VIEC',
    CHUC_DANH: 'CHUC_DANH'
  };

  public static readonly INFO = {
    PERSONAL: 'PERSONAL'
  };


  public static readonly LABOR_STRUCTURE_CHART_LIST_TAG = [
    { value: 'GENDER', label: 'hrm.modelPlan.label.gender' },
    { value: 'EDUCATION_LEVEL', label: 'hrm.modelPlan.label.level' },
    { value: 'EMP_TYPE', label: 'hrm.modelPlan.label.empType' },
    { value: 'ORG', label: 'hrm.modelPlan.label.org' }
  ];

  public static readonly STATUS_EMP = [
    { value: '1', label: 'modelPlan.label.workIn', color: '#06A561', bgColor: '#DAF9EC' },
    { value: '2', label: 'modelPlan.label.contractPending', color: '#F99600', bgColor: '#FFF2DA' },
    { value: '3', label: 'modelPlan.label.workOut', color: '#FA0B0B', bgColor: '#FDE7EA' }
  ];
  public static readonly DOCUMENT_TYPE = [
    { value: 'IN', label: 'hrm.staffManager.categoryManage.documentTypes.label.in' },
    { value: 'OUT', label: 'hrm.staffManager.categoryManage.documentTypes.label.out' }
  ];

  public static readonly SALARY_TYPE = [
    { value: 'CO_BAN', label: 'hrm.staffManager.categoryManage.salaryRanks.label.basic' },
    { value: 'CHUC_DANH', label: 'hrm.staffManager.categoryManage.salaryRanks.label.school' }
  ];

  public static readonly ACTION_PANEL = {
    VIEW: 'VIEW_MODAL',
    SEARCH: 'SEARCH',
    EDIT: 'EDIT_MODAL',
    ADD: 'ADD_MODAL'
  };
  public static readonly CERT_OTHER: LookupValues = {
    value: 'CERT_OTHER',
    label: 'Khác',
    id: undefined
  };

  public static readonly POSITION_SALARY_TYPE = {
    CHUC_DANH: 'CHUC_DANH',
    CHUC_VU: 'CHUC_VU',
    CONG_VIEC: 'CONG_VIEC'
  };

}
