import { pingModel } from '../services/inference.service.js';

export async function getModelStatus(req, res, next) {
  try {
    const result = await pingModel();

    return res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}
