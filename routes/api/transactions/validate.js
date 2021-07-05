const Joi = require("joi");

/////////////////////ТУТ ВЕСЬ КОД ПЕРЕРОБИТИ!!!!!!!!!!!!!!!!ПОКИ ЯК ЗАГЛУШКА!!!!!!!!!!!

const mongoose = require("mongoose");
//    "phone validate": "(123) 123-1234",
const schemaCreateTransaction = Joi.object({
  name: Joi.string().trim().min(2).max(18).required(),
  email: Joi.string().email().required(),
  phone: Joi.string()
    .pattern(/[(][0-9]{3}[)] [0-9]{3}-[0-9]{4}/)
    .max(18)
    .required(),
  features: Joi.array().optional(),
  favorite: Joi.boolean().optional(),
});

const schemaUpdateTransaction = Joi.object({
  name: Joi.string().trim().min(2).max(18).optional(),
  email: Joi.string().email().optional(),
  phone: Joi.string()
    .pattern(/^[0-9]+$/)
    .max(18)
    .optional(),
  features: Joi.array().optional(),
  favorite: Joi.boolean().optional(),
}).min(1);

const validate = async (schema, req, next) => {
  try {
    await schema.validateAsync(req);
    next();
  } catch (err) {
    next({
      status: 400,
      message: err.message.replace(/"/g, ""),
    });
  }
};

module.exports = {
  validationCreateTransaction: (req, res, next) => {
    return validate(schemaCreateTransaction, req.body, next);
  },
  validationUpdate: (req, res, next) => {
    return validate(schemaUpdateTransaction, req.body, next);
  },
  validateMongoId: (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return next({
        status: 400,
        message: "Invalid ObjectId",
      });
    }

    next();
  },
};
