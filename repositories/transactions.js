const Transaction = require("../model/transaction");

const listTransactions = async (userId, query) => {
  const { sortBy, sortByDesc, filter, limit = 20, offset = 0 } = query;

  const optionsSearch = { owner: userId };
  const results = await Transaction.paginate(optionsSearch, {
    limit,
    offset,
    sort: {
      ...(sortBy ? { [`${sortBy}`]: 1 } : {}),
      ...(sortByDesc ? { [`${sortByDesc}`]: -1 } : {}),
    },
    select: filter ? filter.split("|").join(" ") : "",
    populate: { path: "owner", select: "name email" },
  });
  return results;
};
const getLastTransaction = async (userId) => {
  const results = await Transaction.find({ owner: userId }).sort({
    createdAt: -1,
  });

  return results[0];
};

const addTransaction = async (userId, body, balance) => {
  const result = await Transaction.create({ owner: userId, ...body, balance });
  return result;
};

module.exports = {
  addTransaction,
  listTransactions,
  getLastTransaction,
};

// const getById = async (userId, id) => {
//   const result = await Transaction.findOne({ _id: id, owner: userId }).populate({
//     path: "owner",
//     select: "email name",
//   });
//   return result;
// };

// const remove = async (userId, id) => {
//   const result = await Transaction.findOneAndRemove({ _id: id, owner: userId });
//   return result;
// };
