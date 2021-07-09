const Joi = require("joi");
// const mongoose = require("mongoose");

const schemaCreateTransaction = Joi.object({
  date: Joi.date().required(),
  type: Joi.string().required(),
  category: Joi.string().required(),
  comments: Joi.string().optional(),
  sum: Joi.string().required(),
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
  validationCreateTransaction: (req, res, next) => {
    return validate(schemaCreateTransaction, req.body, next);
  },
  //   validateMongoId: (req, res, next) => {
  //     if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
  //       return next({
  //         status: 400,
  //         message: "Invalid ObjectId",
  //       });
  //     }

  //     next();
  //   },
};
