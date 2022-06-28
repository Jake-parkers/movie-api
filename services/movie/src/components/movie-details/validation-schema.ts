import joi from 'joi';

export const CREATE_MOVIE_SCHEMA = joi.object({
  title: joi.string().trim().required(),
  user_id: joi.string().trim().required().min(3)
});


export const GET_MOVIES_SCHEMA = joi.object({
  user_id: joi.string().trim().required().min(3)
});
