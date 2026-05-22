import { ApiError } from '../utils/apiError.js';

export function errorMiddleware(err, req, res, next) {
  console.error(err);

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      error: {
        message: err.message,
        details: err.details,
      },
    });
  }

  return res.status(500).json({
    success: false,
    error: {
      message: 'Internal server error',
    },
  });
}