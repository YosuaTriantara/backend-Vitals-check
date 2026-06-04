import * as screeningService from "../services/screening.service.js";

export async function createScreening(req, res, next) {
  try {
    const { isWarmingUp, ...screening } =
      await screeningService.createScreening(req.user.id, req.body);

    return res.status(201).json({
      success: true,
      data: screening,
      ...(isWarmingUp && {
        meta: {
          isWarmingUp: true,
          message:
            "Model AI sedang warming up. Hasil screening ini menggunakan estimasi sementara.",
        },
      }),
    });
  } catch (error) {
    next(error);
  }
}

export async function getScreenings(req, res, next) {
  try {
    const screenings = await screeningService.getScreenings(req.user.id);

    return res.json({
      success: true,
      data: screenings,
    });
  } catch (error) {
    next(error);
  }
}

export async function getScreening(req, res, next) {
  try {
    const screening = await screeningService.getScreeningById(
      req.user.id,
      req.params.id,
    );

    return res.json({
      success: true,
      data: screening,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteScreening(req, res, next) {
  try {
    await screeningService.deleteScreening(req.user.id, req.params.id);

    return res.json({
      success: true,
      message: "Screening deleted successfully",
    });
  } catch (error) {
    next(error);
  }
}
