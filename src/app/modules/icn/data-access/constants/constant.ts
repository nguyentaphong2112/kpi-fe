import { IHbtOption } from '@core/models/IOption';

export class Constant {
  public static readonly ListEmpTypeCode: IHbtOption<string>[] = [
    { value: 'SQ', label: 'SQ' },
    { value: 'QNCN', label: 'QNCN' },
    { value: 'CCQP', label: 'CCQP' },
    { value: 'VCQP', label: 'VCQP' },
    { value: 'CNQP', label: 'CNQP' },
    { value: 'HĐLĐ', label: 'HĐLĐ' }
  ];

  public static readonly SelectArrearsPrePeriodStatus: IHbtOption<string>[] = [
    { value: '1', label: 'Đã truy lĩnh' },
    { value: '0', label: 'Chưa thực hiện' }
  ];

  public static readonly ListReportPeriodType: IHbtOption<string>[] = [
    { value: 'MONTH', label: 'Tháng' },
    { value: 'QUARTER', label: 'Quý' },
    { value: 'YEAR', label: 'Năm' }
  ];

  public static readonly ListReportQuarter: IHbtOption<string>[] = [
    { value: '1', label: 'Quý 1' },
    { value: '2', label: 'Quý 2' },
    { value: '3', label: 'Quý 3' },
    { value: '4', label: 'Quý 4' }
  ];

  public static readonly LIST_INPUT_TYPE = [
    { value: 0, label: 'Import excel' },
    { value: 1, label: 'Nhập trên giao diện' }
  ];

  public static readonly LIST_TYPE = [
    { value: 'Y', label: 'Đã tính thuế' },
    { value: 'N', label: 'Chưa tính thuế' }
  ];

  public static readonly FUNCTION_CODE = {
    ICN_INSURANCE_CONTRIBUTIONS: 'ICN_INSURANCE_CONTRIBUTIONS'
  };

  public static readonly STATUS = {
    DU_THAO: 'DU_THAO',
    PHE_DUYET: 'PHE_DUYET'
  };

  public static readonly TYPE = {
    TRUY_LINH: 'TRUY_LINH',
    TRUY_THU: 'TRUY_THU',
    TRUY_THU_BHYT: 'TRUY_THU_BHYT',
    KO_THU: 'KO_THU',
    THU_BHXH: 'THU_BHXH',
    THAI_SAN: 'THAI_SAN'
  };
}
