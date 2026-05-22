import prisma from '../config/db.js';
import { predictRisk } from './inference.service.js';
import { ApiError } from '../utils/apiError.js';

function calculateBmi(weightKg, heightCm) {
  const heightM = heightCm / 100;
  return Number((weightKg / (heightM * heightM)).toFixed(2));
}

export async function createScreening(userId, input) {
  const bmi = calculateBmi(input.weightKg, input.heightCm);

  const prediction = await predictRisk({
    ...input,
    bmi,
  });

  const riskScore = prediction.riskScore;
  const riskCategory = prediction.riskCategory;

  const result = await prisma.$transaction(async (tx) => {
    const screening = await tx.screening.create({
      data: {
        userId,
        age: input.age,
        gender: input.gender,
        heightCm: input.heightCm,
        weightKg: input.weightKg,
        bmi,
        systolicBp: input.systolicBp,
        diastolicBp: input.diastolicBp,
        bloodGlucose: input.bloodGlucose,
        riskScore,
        riskCategory,
        rawPrediction: prediction,
      },
    });

    await tx.healthProfile.upsert({
      where: {
        userId,
      },
      update: {
        age: input.age,
        gender: input.gender,
        heightCm: input.heightCm,
        weightKg: input.weightKg,
        bmi,
        systolicBp: input.systolicBp,
        diastolicBp: input.diastolicBp,
        bloodGlucose: input.bloodGlucose,
        lastScreeningId: screening.id,
      },
      create: {
        userId,
        age: input.age,
        gender: input.gender,
        heightCm: input.heightCm,
        weightKg: input.weightKg,
        bmi,
        systolicBp: input.systolicBp,
        diastolicBp: input.diastolicBp,
        bloodGlucose: input.bloodGlucose,
        lastScreeningId: screening.id,
      },
    });

    await tx.user.update({
      where: { id: userId },
      data: { isOnboarded: true },
    });

    return screening;
  });

  return result;
}


export async function getScreenings(userId) {
  return prisma.screening.findMany({
    where: {
      userId,
      deletedAt: null,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}

export async function getScreeningById(userId, screeningId) {
  const screening = await prisma.screening.findFirst({
    where: {
      id: screeningId,
      userId,
      deletedAt: null,
    },
  });

  if (!screening) {
    throw new ApiError(404, 'Screening not found');
  }

  return screening;
}

export async function deleteScreening(userId, screeningId) {
  const screening = await prisma.screening.findFirst({
    where: {
      id: screeningId,
      userId,
      deletedAt: null,
    },
  });

  if (!screening) {
    throw new ApiError(404, 'Screening not found');
  }

  return prisma.screening.update({
    where: {
      id: screeningId,
    },
    data: {
      deletedAt: new Date(),
    },
  });
}