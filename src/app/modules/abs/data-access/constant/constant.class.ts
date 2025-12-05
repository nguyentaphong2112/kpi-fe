import {ObjectCategory} from "@app/modules/abs/data-access/models/approval-flow";


export class Constant {

  public static readonly REQUEST_STATUS = {
    DRAFT: 1, //Dự thảo
    WAIT_APPROVE: 2, //Chờ phê duyệt
    APPROVED: 3, //Đã phê duyệt
    REJECT: 4,  //Từ chối phê duyệt
    CANCEL: 5, //Đã Hủy
    AJUST: 6, //Đề nghị điều chỉnh
    REQUEST_CANCEL: 7, //Đề nghị hủy
    WAIT_APPROVE_BACKDATE: 8, //Chờ xét duyệt backdate
    CANCEL_BACKDATE: 9, //Chờ xét duyệt backdate
  }

  public static readonly TAG = {
    STATUS_DRAFT: '#2db7f5',
    STATUS_WAIT_APPROVE: '#36f5e8',
    STATUS_APPROVED: '#87d068',
    STATUS_REJECT: '#f50',
    STATUS_REQUEST_CANCEL: '#f2bb74',
    STATUS_CANCEL: '#d4d3cf',
    STATUS_AJUST: '#f5e942',
    WAIT_APPROVE_BACKDATE: '#f5582d',
  };

  public static readonly FILE_NAME_EXPORT = {
    WORK_EARLY: "DS_Dang_ky_di_lam_som.xlsx",
    WORK_TRAVEL: "DS_Dang_ky_di_cong_tac.xlsx",
    OT: "DS_Dang_ky_cham_cong_OT.xlsx",
    SATURDAY: "DS_Dang_ky_cham_cong_thu_7.xlsx",
    TRAINING: "DS_Dang_ky_đi_dao_tao.xlsx",
    LEAVE: "DS_De_nghi_nghi.xlsx",
  }
  public static readonly PAGE_NAME = {
    APPROVE: "APPROVE", // "Màn hình phê duyệt đơn nghỉ"
    EMPLOYEE: "EMPLOYEE", // "Màn hình đơn nghỉ của tôi hoặc tôi tạo"
    ADMIN:  "ADMIN", // "Màn hình quản lý nghỉ bên HR"
  }

  public static readonly EMP_STATUS_DATASOURCE = [
    { label: 'Hiện diện', value: 1 },
    { label: 'Tạm hoãn', value: 2 },
    { label: 'Nghỉ việc', value: 3 },
  ];

  public static readonly REQUEST_STATUS_DATASOURCE = [
    { label: 'Dự thảo', value: Constant.REQUEST_STATUS.DRAFT },
    { label: 'Chờ phê duyệt', value: Constant.REQUEST_STATUS.WAIT_APPROVE },
    { label: 'Đã phê duyệt', value: Constant.REQUEST_STATUS.APPROVED },
    { label: 'Từ chối phê duyệt', value: Constant.REQUEST_STATUS.REJECT },
    { label: 'Đề nghị hủy', value: Constant.REQUEST_STATUS.REQUEST_CANCEL },
    { label: 'Đã hủy', value: Constant.REQUEST_STATUS.CANCEL },
    { label: 'Đề nghị điều chỉnh', value: Constant.REQUEST_STATUS.AJUST },
    { label: 'Chờ xét duyệt backdate', value: Constant.REQUEST_STATUS.WAIT_APPROVE_BACKDATE },
    { label: 'Chờ XD hủy backdate', value: Constant.REQUEST_STATUS.CANCEL_BACKDATE },
  ];


  public static readonly REQUEST_STATUS_APPROVAL_DATA_SOURCE = [
    { label: 'Đã phê duyệt', value: Constant.REQUEST_STATUS.APPROVED },
    { label: 'Chờ xét duyệt backdate', value: Constant.REQUEST_STATUS.WAIT_APPROVE_BACKDATE },
    { label: 'Chờ XD hủy backdate', value: Constant.REQUEST_STATUS.CANCEL_BACKDATE },
    { label: 'Đã hủy', value: Constant.REQUEST_STATUS.CANCEL },
    { label: 'Đề nghị điều chỉnh', value: Constant.REQUEST_STATUS.AJUST },
  ];

  public static readonly NOT_ALLOW_EDIT = [
    Constant.REQUEST_STATUS.WAIT_APPROVE_BACKDATE,
    Constant.REQUEST_STATUS.CANCEL_BACKDATE,
    Constant.REQUEST_STATUS.CANCEL,
    Constant.REQUEST_STATUS.AJUST
  ];

  public static readonly NOT_ALLOW_DELETE = [
    Constant.REQUEST_STATUS.WAIT_APPROVE_BACKDATE,
    Constant.REQUEST_STATUS.CANCEL_BACKDATE,
    Constant.REQUEST_STATUS.CANCEL,
    Constant.REQUEST_STATUS.AJUST
  ];

  public static readonly SCREEN_MODE = {
    CREATE: 'CREATE', // Thêm mới
    UPDATE: 'UPDATE', // Cập nhật
    AJUST: 'AJUST', // Điều chỉnh
    VIEW: 'VIEW', // Xem chi tiết
  }

  public static readonly CATALOGS = {
    LY_DO_NGHI: "LY_DO_NGHI",
    PHAN_LOAI_NGAY_CONG: "PHAN_LOAI_NGAY_CONG",
    DOI_TUONG_CV: "DOI_TUONG_CV"
  }

  public static readonly FILETYPE : string = ".xlsx,.xls";
  public static readonly FILETYPE_UPLOAD : string = ".zip, .rar, .7z, .pdf, .png, .jpg, .jpeg, .bmp";

  public static readonly HR_LEVELS : ObjectCategory[] = [
    { label: 'staffAbs.approvalFlow.hrLevelSelect.LEVEL0', value: '0' }, // Không cần
    { label: 'staffAbs.approvalFlow.hrLevelSelect.LEVEL1', value: '1'}, //HR HO
    { label: 'staffAbs.approvalFlow.hrLevelSelect.LEVEL2', value: '2' }, //HR HO và TP DVNS
    { label: 'staffAbs.approvalFlow.hrLevelSelect.LEVEL3', value: '3' }, //HR HO , TP DVNS và GĐ NS
  ]

  public static readonly CatalogType = {
    LOAI_HINH_CHAM_CONG: 'LOAI_HINH_CHAM_CONG',
    ABS_VI_TRI_TRUC: 'ABS_VI_TRI_TRUC'
  }

  public static readonly MODULE_NAME = {
    ANNUAL_LEAVES: 'THONG_TIN_PHEP_NAM',
    REQUEST: 'LY_DO_NGHI'
  };

  public static readonly EXTEND_FIELD_TYPE = {
    TEXT: 'text',
    DATE: 'date',
    CHECKBOX: 'checkbox',
    RADIO: 'radio',
    NUMBER: 'number'
  }

  public static readonly LEAVE_TYPE = {
    LEAVE: "LEAVE",
    WORK_EARLY: "WORK_EARLY",
    WORK_TRAVEL: "WORK_TRAVEL",
    BASIC_RESEARCH: "BASIC_RESEARCH",
    MISSION: "MISSION",
    OT: "OT",
    SATURDAY: "SATURDAY",
    TRAINING: "TRAINING",
  }

  public static readonly PART_OF_TIME_TYPE = {
    ALL: "ALL",
    AM: "AM",
    PM: "PM",
  }

  public static readonly LIST_PART_OF_TIME: ObjectCategory[] = [
    { label: 'staffAbs.timekeepingManagement.partOfDay.ALL', value: this.PART_OF_TIME_TYPE.ALL}, // cả ngày
    { label: 'staffAbs.timekeepingManagement.partOfDay.AM', value: this.PART_OF_TIME_TYPE.AM }, // buổi sáng
    { label: 'staffAbs.timekeepingManagement.partOfDay.PM', value: this.PART_OF_TIME_TYPE.PM } // buổi chiều
  ];

  public static readonly REQUESTS_STATUS = {
    DU_THAO: 'DU_THAO',
    CHO_PHE_DUYET: 'CHO_PHE_DUYET',
    DA_PHE_DUYET: 'DA_PHE_DUYET',
    DA_HUY: 'DA_HUY',
    DA_TU_CHOI: 'DA_TU_CHOI',
  };

  public static readonly ATTENDANCE_HISTORIES_STATUS = {
    CHO_PHE_DUYET: 'CHO_PHE_DUYET',
    PHE_DUYET: 'PHE_DUYET',
    TU_CHOI: 'TU_CHOI',
  };

  public static readonly LIST_STATUS = [
    { value: 'PHE_DUYET', label: 'abs.attendanceHistories.label.approve' },
    { value: 'TU_CHOI', label: 'abs.attendanceHistories.label.reject' }
  ];

  // public static filterGetOneRequestLeave(request: Request): RequestLeave {
  //   const fistLeave = request.listAbsRequestLeaves ? request.listAbsRequestLeaves[0] : {}
  //   const requestLeave = {...request, ...fistLeave}
  //   return requestLeave;
  // }
}
