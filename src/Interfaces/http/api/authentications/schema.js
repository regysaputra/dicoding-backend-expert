import Joi from 'joi';

export const loginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

export const updateSchema = Joi.object({
  refreshToken: Joi.string().required(),
});