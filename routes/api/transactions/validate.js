const Joi = require("joi").extend(require("@joi/date"));
const { HttpCode } = require("../../../helpers/constants");

const schemaCreateTransaction = Joi.object({
  date: Joi.date().format("YYYY-MM-DD").required(),
  type: Joi.string().required(),
  category: Joi.string().required(),
  comments: Joi.string().optional(),
  sum: Joi.number().min(0).required(),
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
  validationCreateTransaction: (req, res, next) => {
    return validate(schemaCreateTransaction, req.body, next);
  },
};
