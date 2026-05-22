import prisma from '../config/db.js';
import { ApiError } from '../utils/apiError.js';

function calculateBmi(weightKg, heightCm) {
  if (!weightKg || !heightCm) return null;

  const heightM = heightCm / 100;
  return Number((weightKg / (heightM * heightM)).toFixed(2));
}

export async function getProfile(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      isOnboarded: true,
      createdAt: true,
      updatedAt: true,
      healthProfile: {
        where: {
          deletedAt: null,
        },
      },
    },
  });

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  return user;
}

export async function updateProfile(userId, input) {
  const existingProfile = await prisma.healthProfile.findUnique({
    where: { userId },
  });

  const heightCm = input.heightCm ?? existingProfile?.heightCm;
  const weightKg = input.weightKg ?? existingProfile?.weightKg;
  const bmi = calculateBmi(weightKg, heightCm);

  const profile = await prisma.$transaction(async (tx) => {
    const healthProfile = await tx.healthProfile.upsert({
      where: { userId },
      update: {
        ...input,
        bmi,
      },
      create: {
        userId,
        ...input,
        bmi,
      },
    });

    await tx.user.update({
      where: { id: userId },
      data: { isOnboarded: true },
    });

    return healthProfile;
  });

  return profile;
}