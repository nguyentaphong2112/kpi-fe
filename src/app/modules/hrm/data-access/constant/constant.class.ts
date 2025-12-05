import { environment } from '@env/environment';
import { LookupValues } from '@shared/data-access';
import { _variable } from '@core/global-style/_variable';

export class Constant {

  public static readonly ADDRESS_TYPES = {
    THUONG_TRU: 'THUONG_TRU',
    HIEN_TAI: 'HIEN_TAI'
  };


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


  public static readonly LIST_FORCE_UPDATE = [
    { value: true, label: 'hrm.staffManager.insuranceSalaryProcess.label.yes' },
    { value: false, label: 'hrm.staffManager.insuranceSalaryProcess.label.no' }
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


  public static readonly LABOR_STRUCTURE_CHART_LIST_TAG = [
    { value: 'GENDER', label: 'hrm.modelPlan.label.gender' },
    { value: 'EDUCATION_LEVEL', label: 'hrm.modelPlan.label.level' },
    { value: 'EMP_TYPE', label: 'hrm.modelPlan.label.empType' },
    { value: 'ORG', label: 'hrm.modelPlan.label.org' }
  ];




  public static readonly ACTION_PANEL = {
    VIEW: 'VIEW_MODAL',
    SEARCH: 'SEARCH',
    EDIT: 'EDIT_MODAL',
    ADD: 'ADD_MODAL'
  };


}
