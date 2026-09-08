import Joi from "joi";

export const addThreadSchema = Joi.object({
  title: Joi.string().required(),
  body: Joi.string().required(),
});

