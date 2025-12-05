export enum Actions {
  CREATE,
  UPDATE,
  VIEW,
  DELETE,
  SWITCH,
  CHECKBOX,
  LOGOUT,
  CHOOSE_ITEM,
}

export enum REGEX {
  SPECIAL_TEXT = '^[A-Za-z0-9ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêắấớốếứìíòóôõùýúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]*',
  SPECIAL_TEXT_CODE = '^[A-Za-z0-9_\\-.ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêắấớốếứìíòóôõùýúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]*'
}

export enum Scopes {
  VIEW = 'VIEW',
  CREATE = 'CREATE',
  EDIT = 'UPDATE',
  DELETE = 'DELETE',
  APPROVE = 'APPROVE',
  IMPORT = 'IMPORT',
  UPLOAD = 'UPLOAD',
  DOWNLOAD = 'DOWNLOAD',
  ADJUSTED = 'ADJUSTED',
  CORRECTION = 'CORRECTION',
  CANCEL = 'CANCEL',
  REVIEW = 'REVIEW',
}

export enum SessionKey {
  MENU = 'MENU',
  FUNCTION_CODE = 'FUNCTION_CODE',
}
