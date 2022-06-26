import joi from 'joi';

export const CREATE_MOVIE_SCHEMA = joi.object({
  title: joi.string().trim().required(),
  username: joi.string().trim().required().min(3),
  role: joi.string().trim().required().valid("basic", "premium")
});
