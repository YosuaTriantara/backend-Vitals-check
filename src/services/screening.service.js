import prisma from "../config/db.js";
import { predictRisk } from "./inference.service.js";
import { ApiError } from "../utils/apiError.js";

function calculateBmi(weightKg, heightCm) {
  const heightM = heightCm / 100;
  return Number((weightKg / (heightM * heightM)).toFixed(2));
}

export async function createScreening(userId, input) {
  const bmi = calculateBmi(input.weightKg, input.heightCm);

  // Masukkan bmi ke input agar buildModelPayload di inference service bisa menggunakannya
  const prediction = await predictRisk({ ...input, bmi });

  const { riskScore, riskCategory, predictions, isWarmingUp, rawPrediction } =
    prediction;

  const result = await prisma.$transaction(async (tx) => {
    const screening = await tx.screening.create({
      data: {
        userId,
        age: input.age,
        gender: input.gender,
        heightCm: input.heightCm,
        weightKg: input.weightKg,
        bmi,
        genHlth: input.genHlth,
        mentHlth: input.mentHlth,
        physHlth: input.physHlth,
        diffWalk: input.diffWalk,
        cholCheck: input.cholCheck,
        smoker: input.smoker,
        physActivity: input.physActivity,
        fruits: input.fruits,
        veggies: input.veggies,
        hvyAlcoholConsump: input.hvyAlcoholConsump,
        riskScore,
        riskCategory,
        predictions, // per-disease breakdown (Json column)
        rawPrediction, // full API response (Json column)
      },
    });

    await tx.healthProfile.upsert({
      where: { userId },
      update: {
        age: input.age,
        gender: input.gender,
        heightCm: input.heightCm,
        weightKg: input.weightKg,
        bmi,
        genHlth: input.genHlth,
        mentHlth: input.mentHlth,
        physHlth: input.physHlth,
        diffWalk: input.diffWalk,
        cholCheck: input.cholCheck,
        smoker: input.smoker,
        physActivity: input.physActivity,
        fruits: input.fruits,
        veggies: input.veggies,
        hvyAlcoholConsump: input.hvyAlcoholConsump,
        lastScreeningId: screening.id,
      },
      create: {
        userId,
        age: input.age,
        gender: input.gender,
        heightCm: input.heightCm,
        weightKg: input.weightKg,
        bmi,
        genHlth: input.genHlth,
        mentHlth: input.mentHlth,
        physHlth: input.physHlth,
        diffWalk: input.diffWalk,
        cholCheck: input.cholCheck,
        smoker: input.smoker,
        physActivity: input.physActivity,
        fruits: input.fruits,
        veggies: input.veggies,
        hvyAlcoholConsump: input.hvyAlcoholConsump,
        lastScreeningId: screening.id,
      },
    });

    await tx.user.update({
      where: { id: userId },
      data: { isOnboarded: true },
    });

    return screening;
  });

  // Sertakan isWarmingUp agar controller bisa menginfokan ke frontend
  return { ...result, isWarmingUp: isWarmingUp ?? false };
}

export async function getScreenings(userId) {
  return prisma.screening.findMany({
    where: { userId, deletedAt: null },
    orderBy: { createdAt: "desc" },
  });
}

export async function getScreeningById(userId, screeningId) {
  const screening = await prisma.screening.findFirst({
    where: { id: screeningId, userId, deletedAt: null },
  });

  if (!screening) {
    throw new ApiError(404, "Screening not found");
  }

  return screening;
}

export async function deleteScreening(userId, screeningId) {
  const screening = await prisma.screening.findFirst({
    where: { id: screeningId, userId, deletedAt: null },
  });

  if (!screening) {
    throw new ApiError(404, "Screening not found");
  }

  return prisma.screening.update({
    where: { id: screeningId },
    data: { deletedAt: new Date() },
  });
}
