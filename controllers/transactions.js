const Contacts = require("../repositories/transactions");



/////////////////////ТУТ ВЕСЬ КОД ПЕРЕРОБИТИ!!!!!!!!!!!!!!!!ПОКИ ЯК ЗАГЛУШКА!!!!!!!!!!!



const getAll = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { docs: contacts, ...rest } = await Contacts.listContacts(
      userId,
      req.query
    );
    console.log({ ...rest });
    return res.json({
      status: "success",
      code: 200,
      data: { contacts, ...rest },
    });
  } catch (e) {
    next(e);
  }
};

const getById = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const contact = await Contacts.getContactById(userId, req.params.id);
    if (contact) {
      return res.json({ status: "success", code: 200, data: { contact } });
    }
    return res.json({ status: "error", code: 404, message: "Not found" });
  } catch (e) {
    next(e);
  }
};

const create = async (req, res, next) => {
  try {
    const userId = req.user.id;
    if (!req.body.name || !req.body.email || !req.body.phone) {
      return res.status(201).json({ message: "missing required name field" });
    }
    const contact = await Contacts.addContact(userId, req.body);
    return res.status(201).json({
      status: "success",
      code: 201,
      data: { contact },
    });
  } catch (e) {
    if (e.name === "ValidationError") {
      e.status = 400;
    }
    next(e);
  }
};

const remove = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const contact = await Contacts.removeContact(userId, req.params.id);
    if (contact) {
      return res.json({
        status: "success",
        code: 200,
        message: "contact deleted",
        data: { contact },
      });
    }
    return res.json({ status: "error", code: 404, message: "Not found" });
  } catch (e) {
    next(e);
  }
};

const update = async (req, res, next) => {
  try {
    const userId = req.user.id;
    console.log(req.body);
    const updated = await Contacts.updateContact(
      userId,
      req.params.id,
      req.body
    );

    if (updated) {
      return res.json({
        status: "success",
        code: 200,
        message: "contact updated.",
        data: { updated },
      });
    }
    return res
      .status(404)
      .json({ status: "error", code: 404, message: "Not found." });
  } catch (e) {
    next(e);
  }
};

module.exports = {
  getAll,
  create,
  update,
  remove,
  getById,
};
