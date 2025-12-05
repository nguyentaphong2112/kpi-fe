export class Constant {
  public static readonly FUNCTION_CODE = {
    INTERNSHIP_SESSION: 'INTERNSHIP_SESSION',
    TRAINING_PROCESS: 'TRAINING_PROCESS',
    EXTERNAL_TRAINING: 'EXTERNAL_TRAINING',
    MENTORING_TRAINEES: 'MENTORING_TRAINEES',
    MENTORING_TRAINERS: 'MENTORING_TRAINERS',
    RESEARCH: 'RESEARCH'
  };

  public static readonly TYPE = {
    NGHIEM_THU_DE_TAI: 'NGHIEM_THU_DE_TAI',
    CHO_PHEP_THUC_HIEN: 'CHO_PHEP_THUC_HIEN',
    PHE_DUYET_DE_TAI: 'PHE_DUYET_DE_TAI',
    DANH_GIA_XEP_LOAI: 'DANH_GIA_XEP_LOAI'
  };

  public static readonly CATEGORY = {
    KPI_DON_VI_TINH: 'KPI_DON_VI_TINH'
  };

  public static readonly STATUS = {
    PHE_DUYET: 'PHE_DUYET',
    DU_THAO: 'DU_THAO',
    DE_NGHI_DIEU_CHINH: 'DE_NGHI_DIEU_CHINH',
    CHO_PHE_DUYET: 'CHO_PHE_DUYET',
    DA_NGHIEM_THU: 'DA_NGHIEM_THU',
    CHO_PHEP_THUC_HIEN: 'CHO_PHEP_THUC_HIEN',
    PHE_DUYET_THONG_QUA: 'PHE_DUYET_THONG_QUA',
    TU_CHOI_THONG_QUA: 'TU_CHOI_THONG_QUA',
    MOI_DANG_KY: 'MOI_DANG_KY',
    DA_DANH_GIA: 'DA_DANH_GIA',
  };

  public static readonly TITLE = {
    PHE_DUYET_DE_TAI: 'Phê duyệt thông qua',
    CHO_PHEP_THUC_HIEN: 'Cho phép thực hiện',
    NGHIEM_THU_DE_TAI: 'Nghiệm thu đề tài',
    DANH_GIA_XEP_LOAI: 'Đánh giá-xếp loại'
  };

  public static readonly LIST_REPORT_TYPE = [
    { value: 'LMS_NOI_VIEN_CHI_TIET', label: 'lms.export-report.label.internalDetail' },
    { value: 'LMS_TONG_SO_TIN_CHI', label: 'lms.export-report.label.hourTotal' },
    { value: 'LMS-TKE-DAO-TAO-LIEN-TUC-12', label: 'lms.export-report.label.internalStatistic12' },
    { value: 'LMS-TKE-DAO-TAO-LIEN-TUC-24', label: 'lms.export-report.label.internalStatistic24' },
    { value: 'LMS_NOI_VIEN_THONG_KE', label: 'lms.export-report.label.internalStatistic' },
    { value: 'LMS_NHAN_VIEN_Y_TE', label: 'lms.export-report.label.healthcareStaff' },
  ];
}
