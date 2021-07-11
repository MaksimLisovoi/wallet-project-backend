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

const getCurrentBalance = async (userId) => {
  let lastTransaction = await Transaction.find({ owner: userId }).sort({
    createdAt: -1,
  });
  console.log("lastTransaction", lastTransaction);
  return lastTransaction[0] ? lastTransaction[0].balance : 0;
};

const addTransaction = async (userId, body, balance) => {
  const result = await Transaction.create({ owner: userId, ...body, balance });
  return result;
};

const getStatisticsTransactions = async (userId, entryDate, stopDate) => {
  const result = await Transaction.find({
    owner: userId,
    date: { $gte: entryDate, $lt: stopDate },
  });
  return result;
};

module.exports = {
  addTransaction,
  listTransactions,
  getCurrentBalance,
  getStatisticsTransactions,
};
