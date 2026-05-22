import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/apiError.js';

export function protect(req, res, next) {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new ApiError(401, 'Unauthorized, token tidak ada');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof ApiError) return next(error);
    next(new ApiError(401, 'Token tidak valid'));
  }
}