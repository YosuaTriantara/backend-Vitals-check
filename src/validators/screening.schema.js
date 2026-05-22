import Joi from 'joi';

export const createScreeningSchema = Joi.object({
  age: Joi.number().integer().min(1).max(150).required(),
  gender: Joi.string().valid('male', 'female').required(),

  heightCm: Joi.number().positive().required(),
  weightKg: Joi.number().positive().required(),

  systolicBp: Joi.number().integer().min(50).max(250).required(),
  diastolicBp: Joi.number().integer().min(30).max(150).required(),
  bloodGlucose: Joi.number().min(30).max(500).required(),
});