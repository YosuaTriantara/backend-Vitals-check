import * as userService from '../services/user.service.js';

export async function getProfile(req, res, next) {
  try {
    const profile = await userService.getProfile(req.user.id);

    return res.json({
      success: true,
      data: profile,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateProfile(req, res, next) {
  try {
    const profile = await userService.updateProfile(req.user.id, req.body);

    return res.json({
      success: true,
      data: profile,
    });
  } catch (error) {
    next(error);
  }
}