import joi from 'joi';

export const LOGIN_SCHEMA = joi.object({
  username: joi.string().trim().required().min(3),
  password: joi.string().trim().required(),
});
