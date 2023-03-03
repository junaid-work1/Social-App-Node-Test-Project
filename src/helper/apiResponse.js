export const sendSuccessResponse = (res, data, statusCode, statusText) => {
  return res.status(statusCode).json({
    status: statusText,
    data,
  });
};

export const sendErrorResponse = (res, errorMessage, statusCode, statusText) => {
  res.status(statusCode).json({
    status: statusText,
    error: errorMessage,
  });
};
