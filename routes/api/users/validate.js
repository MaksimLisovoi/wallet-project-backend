const Joi = require("joi");
const { HttpCode } = require("../../../helpers/constants");

const schemaSignup = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  name: Joi.string().trim().min(2).max(18).required(),
});
const schemaLogin = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const validate = async (schema, req, next) => {
  try {
    await schema.validateAsync(req);
    next();
  } catch (err) {
    next({
      status: HttpCode.BAD_REQUEST,
      message: err.message.replace(/"/g, ""),
    });
  }
};

module.exports = {
  validationSignup: (req, res, next) => {
    return validate(schemaSignup, req.body, next);
  },
  validationLogin: (req, res, next) => {
    return validate(schemaLogin, req.body, next);
  },
};
