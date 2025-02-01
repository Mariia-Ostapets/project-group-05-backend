import { HttpError } from 'http-errors';

export const errorHandler = (err, req, res, next) => {
  const { status = 500, message } = err;
  if (err instanceof HttpError) {
    res.status(err.status).json({
      status: err.status,
      message,
    });
    return;
  }

  res.status(status).json({
    status,
    message,
  });
};
