import Joi from 'joi';

export const updateProfileSchema = Joi.object({
  gender: Joi.string().valid('male', 'female').optional(),
  birthDate: Joi.date().iso().optional(),
  age: Joi.number().integer().min(1).max(150).optional(),

  heightCm: Joi.number().positive().optional(),
  weightKg: Joi.number().positive().optional(),

  systolicBp: Joi.number().integer().min(50).max(250).optional(),
  diastolicBp: Joi.number().integer().min(30).max(150).optional(),
  bloodGlucose: Joi.number().min(30).max(500).optional(),
}).min(1);