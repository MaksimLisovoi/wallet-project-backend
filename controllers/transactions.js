const Transaction = require("../repositories/transactions");
const { HttpCode, Categories } = require("../helpers/constants");

const getAll = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { docs: transactions, ...rest } = await Transaction.listTransactions(
      userId,
      req.query
    );
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
      return res.status(HttpCode.BAD_REQUEST).json({
        status: "error",
        code: HttpCode.BAD_REQUEST,
        message: "missing required field",
      });
    }

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

    let date = new Date(req.body.date);
    let stopDate = new Date(date);
    stopDate.setDate(stopDate.getDate() + 1);

    const prevTime = await Transaction.getLastTransactionDateInPeriod(
      userId,
      date,
      stopDate
    );

    if (prevTime) {
      date = new Date(prevTime);
      date = date.setMilliseconds(date.getMilliseconds() + 1);
    }

    const prevBalance = await Transaction.getPrevBalance(userId, date);
    const balanceIncrement =
      req.body.type === "minus" ? -Number(req.body.sum) : Number(req.body.sum);
    const balance = prevBalance + balanceIncrement;

    const transaction = await Transaction.addTransaction(
      userId,
      req.body,
      date,
      balance
    );
    await Transaction.balanceUpdate(userId, date, balanceIncrement);

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

const remove = async (req, res, next) => {
  try {
    const id = req.params.id;
    const userId = req.user.id;
    const delTransaction = await Transaction.deleteTransaction(userId, id);
    if (!delTransaction) {
      return res.status(HttpCode.NOT_FOUND).json({
        status: "error",
        code: HttpCode.NOT_FOUND,
        message: "Transaction not found",
      });
    }
    const balanceIncrement =
      delTransaction.type === "minus"
        ? Number(delTransaction.sum)
        : -Number(delTransaction.sum);

    await Transaction.balanceUpdate(
      userId,
      delTransaction.date,
      balanceIncrement
    );

    return res.status(HttpCode.OK).json({
      status: "OK",
      code: HttpCode.OK,
      message: "Transaction deleted",
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
    return res.status(HttpCode.OK).json({
      status: "OK",
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

    let statistic = await Transaction.getStatisticsTransactions(
      req.user.id,
      entryDate,
      stopDate
    );

    // if (!statistic.length) {
    //   return res.status(HttpCode.NOT_FOUND).json({
    //     status: "error",
    //     code: HttpCode.NOT_FOUND,
    //     message: "no transactions for this month",
    //   });
    // }
    return res.status(HttpCode.OK).json({
      status: "OK",
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
      status: "OK",
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
  remove,
};
