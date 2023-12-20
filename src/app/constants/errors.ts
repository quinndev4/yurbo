export const ERRORS = {
  EVENT: {
    CREATED: 'Event failed to create',
  },
  UNATHORIZED: 'User not authorized',
  UNKNOWN: 'An unknown error occurred',
};

export const getMessage = (object: any) =>
  'message' in object ? object.message : false;

export const getSuccess = (object: any) =>
  'success' in object ? object.success : false;

export const getMessgaeSuccess = (object: any) => ({
  success: getSuccess(object),
  message: getMessage(object),
});

export const getErrorMessage = (error: any) =>
  error instanceof Error ? error.message : ERRORS.UNKNOWN;

export const getErrorMessgaeSuccess = (error: any) => ({
  success: getSuccess(error),
  message: getErrorMessage(error),
});
