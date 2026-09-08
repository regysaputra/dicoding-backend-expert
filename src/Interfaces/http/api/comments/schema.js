import Joi from "joi";

export const addCommentSchema = Joi.object({
  content: Joi.string().required(),
});