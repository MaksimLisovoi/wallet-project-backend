const Contact = require("../model/transaction");

/////////////////////ТУТ ВЕСЬ КОД ПЕРЕРОБИТИ!!!!!!!!!!!!!!!!ПОКИ ЯК ЗАГЛУШКА!!!!!!!!!!!

const listContacts = async (userId, query) => {
  // const results = await Contact.find({ owner: userId }).populate({
  //   path: 'owner',
  //   select: ' email subscription -_id',
  // })

  const {
    sortBy,
    sortByDesc,
    filter,
    favorites = null,
    limit = 20,
    offset = 0,
  } = query;

  const optionsSearch = { owner: userId };
  if (favorites !== null) {
    optionsSearch.favorite = favorites;
  }
  const results = await Contact.paginate(optionsSearch, {
    limit,
    offset,
    sort: {
      ...(sortBy ? { [`${sortBy}`]: 1 } : {}),
      ...(sortByDesc ? { [`${sortByDesc}`]: -1 } : {}),
    },
    select: filter ? filter.split("|").join(" ") : "",
    populate: { path: "owner", select: " email subscription" },
  });
  return results;
};

const getContactById = async (userId, id) => {
  const result = await Contact.findOne({ _id: id, owner: userId }).populate({
    path: "owner",
    select: "email subscription",
  });
  return result;
};

const removeContact = async (userId, id) => {
  const result = await Contact.findOneAndRemove({ _id: id, owner: userId });
  return result;
};

const addContact = async (userId, body) => {
  const result = await Contact.create({ owner: userId, ...body });
  return result;
};

const updateContact = async (userId, id, body) => {
  const result = await Contact.findOneAndUpdate(
    { _id: id, owner: userId },
    { ...body },
    { new: true }
  );
  return result;
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
