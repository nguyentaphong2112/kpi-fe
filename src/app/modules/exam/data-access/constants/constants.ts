export class Constant {
  public static readonly URL_DOWNLOAD = '/v1/attachment-file/download/{attachmentId}/{checksum}';

  public static readonly NAME_STEPS = {
    STEP_1: 'STEP_1',
    STEP_2: 'STEP_2',
    STEP_3: 'STEP_3',
    STEP_4: 'STEP_4',
    STEP_5: 'STEP_5'
  };

  public static readonly LIST_VISIBILITY_CODE = [
    { value: 'PUBLIC', label: 'exam.sessions.label.public' },
    { value: 'PRIVATE', label: 'exam.sessions.label.private' }
  ];
}