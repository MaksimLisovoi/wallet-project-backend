// const { array } = require("joi");
const { Schema, model, SchemaTypes } = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const { Categories } = require("../helpers/constants");

const TransactionSchema = new Schema(
  {
    date: {
      type: Date,
      required: [true, "Date is required."],
    },
    type: {
      type: String,
      required: [true, "Type is required."],
    },
    category: {
      type: String,
      enum: [...Categories.expense, ...Categories.income],
      default: Categories.income[0],
      required: [true, `Category is required`],
    },
    owner: {
      type: SchemaTypes.ObjectId,
      ref: "user",
    },
    comment: { type: String },
    sum: {
      type: Number,
      min: 0,
      required: [true, "Sum is required."],
    },
    balance: {
      type: Number,
      required: [true, "Sum is required."],
    },
  },
  {
    versionKey: false,
    timestamps: true,
    // toJSON: {
    //   virtuals: true,
    //   transform: function (doc, ret) {
    //     delete ret._id;
    //     return ret;
    //   },
    // },
    // toObject: { virtuals: true },
  }
);

TransactionSchema.plugin(mongoosePaginate);
const Transaction = model("transactions", TransactionSchema);

module.exports = Transaction;
