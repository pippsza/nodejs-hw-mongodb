import createHttpError from 'http-errors';

export default function validateBody(schema) {
  return async (req, res, next) => {
    try {
      await schema.validateAsync(req.body, { abortEarly: false });
      next();
    } catch (error) {
      console.log(error);
      const errors = error.details.map((detail) => detail.message);
      next(createHttpError.BadRequest(errors));
    }
  };
}
