const Joi = require("joi");

const schemaSignup = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(2).required(),
  name: Joi.string().trim().min(2).max(18).required(),
});
const schemaLogin = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(2).required(),
});

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
  validationSignup: (req, res, next) => {
    return validate(schemaSignup, req.body, next);
  },
  validationLogin: (req, res, next) => {
    return validate(schemaLogin, req.body, next);
  },
};
