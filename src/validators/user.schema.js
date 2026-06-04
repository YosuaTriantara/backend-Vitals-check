import Joi from "joi";

export const updateProfileSchema = Joi.object({
  // Demografis
  gender: Joi.string().valid("male", "female").optional(),
  birthDate: Joi.date().iso().optional(),
  age: Joi.number().integer().min(1).max(120).optional(),

  // Antropometri
  heightCm: Joi.number().positive().optional(),
  weightKg: Joi.number().positive().optional(),

  // Penilaian kesehatan umum (1 = Excellent … 5 = Poor)
  genHlth: Joi.number().integer().min(1).max(5).optional(),

  // Hari dalam 30 hari terakhir
  mentHlth: Joi.number().integer().min(0).max(30).optional(),
  physHlth: Joi.number().integer().min(0).max(30).optional(),

  // Gaya hidup & riwayat
  diffWalk: Joi.boolean().optional(),
  cholCheck: Joi.boolean().optional(),
  smoker: Joi.boolean().optional(),
  physActivity: Joi.boolean().optional(),
  fruits: Joi.boolean().optional(),
  veggies: Joi.boolean().optional(),
  hvyAlcoholConsump: Joi.boolean().optional(),
}).min(1);
