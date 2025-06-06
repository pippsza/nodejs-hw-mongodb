import Joi from 'joi';

export const contactSchema = Joi.object({
  name: Joi.string().required().min(3).max(20),
  phoneNumber: Joi.string().required().min(3).max(20),
  email: Joi.string().min(3).max(20),
  isFavourite: Joi.boolean(),
  contactType: Joi.string()
    .required()
    .valid('work', 'home', 'personal')
    .min(3)
    .max(20),
  onDuty: Joi.boolean(),
  photo: Joi.string(),
});

export const updatecontactSchema = Joi.object({
  name: Joi.string().min(3).max(20),
  phoneNumber: Joi.string().min(3).max(20),
  email: Joi.string().min(3).max(20),
  isFavourite: Joi.boolean(),
  contactType: Joi.string().valid('work', 'home', 'personal').min(3).max(20),
  onDuty: Joi.boolean(),
  photo: Joi.string(),
});
