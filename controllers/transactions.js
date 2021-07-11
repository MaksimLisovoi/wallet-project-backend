const Transaction = require("../repositories/transactions");
const { HttpCode, Categories } = require("../helpers/constants");

const getAll = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { docs: transactions, ...rest } = await Transaction.listTransactions(
      userId,
      req.query
    );
    console.log({ ...rest });
    return res.status(HttpCode.OK).json({
      status: "success",
      code: HttpCode.OK,
      data: { transactions, ...rest },
    });
  } catch (e) {
    next(e);
  }
};

const create = async (req, res, next) => {
  try {
    const userId = req.user.id;
    if (
      !req.body.date ||
      !req.body.type ||
      !req.body.category ||
      !req.body.sum
    ) {
      return res.status(HttpCode.CREATED).json({
        status: "success",
        code: HttpCode.CREATED,
        message: "missing required field",
      });
    }

    //////////фильтр на соответствие категории типу +/-

    if (
      (req.body.type === "minus" &&
        !Categories.expense.includes(req.body.category)) ||
      (req.body.type !== "minus" &&
        !Categories.income.includes(req.body.category))
    ) {
      return res.status(HttpCode.CONFLICT).json({
        status: "error",
        code: HttpCode.CONFLICT,
        message: "category does not match type",
      });
    }
    //////////////////getBalance
    let balance = await Transaction.getCurrentBalance(userId);
    console.log("1111111111", balance);
    balance =
      req.body.type === "minus"
        ? (balance -= Number(req.body.sum))
        : (balance += Number(req.body.sum));
    ////////////////////
    const transaction = await Transaction.addTransaction(
      userId,
      req.body,
      balance
    );
    return res.status(HttpCode.CREATED).json({
      status: "success",
      code: HttpCode.CREATED,
      data: { transaction },
    });
  } catch (e) {
    if (e.name === "ValidationError") {
      e.status = HttpCode.BAD_REQUEST;
    }
    next(e);
  }
};

const getBalance = async (req, res, next) => {
  try {
    let balance = await Transaction.getCurrentBalance(req.user.id);
    console.log(balance);
    return res.status(HttpCode.OK).json({
      status: "success",
      code: HttpCode.OK,
      data: balance,
    });
  } catch (e) {
    next(e);
  }
};

const getStatistic = async (req, res, next) => {
  try {
    const month = Number(req.query.month);
    const year = Number(req.query.year);

    const entryDate = new Date(year, month, 1);
    const stopDate = new Date(year, month + 1, 1);
    // stopDate.setMilliseconds(stopDate.getMilliseconds() - 1);

    let statistic = await Transaction.getStatisticsTransactions(
      req.user.id,
      entryDate,
      stopDate
    );
    console.log("statistic", statistic);
    if (!statistic.length) {
      return res.status(HttpCode.NOT_FOUND).json({
        status: "error",
        code: HttpCode.NOT_FOUND,
        message: "no transactions for this month",
      });
    }
    return res.status(HttpCode.OK).json({
      status: "success",
      code: HttpCode.OK,
      data: statistic,
    });
  } catch (e) {
    next(e);
  }
};
const getCategories = (req, res, next) => {
  try {
    return res.status(HttpCode.OK).json({
      status: "success",
      code: HttpCode.OK,
      data: Categories,
    });
  } catch (e) {
    next(e);
  }
};

module.exports = {
  getAll,
  create,
  getBalance,
  getStatistic,
  getCategories,
};
