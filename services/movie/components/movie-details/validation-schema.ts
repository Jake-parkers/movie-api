import joi from 'joi';

export const CREATE_MOVIE_SCHEMA = joi.object({
  title: joi.string().trim().required()
});
