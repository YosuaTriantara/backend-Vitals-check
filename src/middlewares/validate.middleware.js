import { ApiError } from '../utils/apiError.js';

export function validate(schema) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      return next(
        new ApiError(
          400,
          'Validation failed',
          error.details.map((detail) => ({
            field: detail.path.join('.'),
            message: detail.message,
          }))
        )
      );
    }

    req.body = value;
    next();
  };
}