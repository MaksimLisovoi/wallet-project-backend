const app = require("../app");
const db = require("../model/db");

require("dotenv").config();

const PORT = process.env.PORT || 3000;

db.then(() => {
  app.listen(PORT, async () => {
    console.log(`Server running. Use our API on port: ${PORT}`);
  });
}).catch((e) => {
  console.log(`error ${e.message}`);
});
