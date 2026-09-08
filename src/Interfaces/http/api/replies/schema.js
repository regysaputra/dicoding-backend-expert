import Joi from "joi";

export const addReplySchema = Joi.object({
  content: Joi.string().required(),
});