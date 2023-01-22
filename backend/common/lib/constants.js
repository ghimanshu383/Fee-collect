exports.USERS= {
  SUPER_ADMIN: 'superAdmin',
  ADMIN: 'admin',
  EMPLOYEE: 'employee',
};
exports.CONTAINERS= ['auth', 'application'];
exports.getResponse = (data)=>{
  return {
    SUCCESS: {
      status: 'success',
      data: data || null,
    },
  };
};
exports.ERRORS = {
  INTERNAL_SERVER: 500,
  UNAUTHORIZED: 401,
  FAILED: 402,
  NOT_FOUND: 404,
};
exports.ERROR_MSG = {
  INTERNAL_SERVER: 'Something went wrong pls try again',
  UNAUTHORIZED: 'You are not authorized to perform this action',
  FAILED: 'Could not process the request',
  NOT_FOUND: 'Not found',
};
exports.REDISFORMAT = {
  tokenFormat: (userId)=>{
    return `${userId}-Token`;
  },
};
exports.FORMTYPES= {
  FORM_ONE: 'formOne',
  FORM_TWO: 'formTwo',
  FORM_THREE: 'formThree',
  FORM_FOUR: 'formFour',
};
exports.ID_TO_DISPLAY_FORMS= ['formOne', 'formFour'];
exports.EXCLUDED_API_FIELDS = ['sort', 'page', 'fields', 'page'];
exports.PAYMENT_TEMPLATE_REF= {
  FORM_ONE: 'FormOneTemplate',
};
