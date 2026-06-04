import Joi from "joi";

export const createScreeningSchema = Joi.object({
  // Demografis
  age: Joi.number().integer().min(1).max(120).required(),
  gender: Joi.string().valid("male", "female").required(),

  // Hanya untuk hitung BMI — disimpan di DB, tidak dikirim langsung ke model
  heightCm: Joi.number().positive().required(),
  weightKg: Joi.number().positive().required(),

  // Penilaian kesehatan umum (1 = Excellent … 5 = Poor)
  genHlth: Joi.number().integer().min(1).max(5).required(),

  // Hari dalam 30 hari terakhir
  mentHlth: Joi.number().integer().min(0).max(30).required(),
  physHlth: Joi.number().integer().min(0).max(30).required(),

  // Gaya hidup & riwayat (boolean)
  diffWalk: Joi.boolean().required(),
  cholCheck: Joi.boolean().required(),
  smoker: Joi.boolean().required(),
  physActivity: Joi.boolean().required(),
  fruits: Joi.boolean().required(),
  veggies: Joi.boolean().required(),
  hvyAlcoholConsump: Joi.boolean().required(),
});
