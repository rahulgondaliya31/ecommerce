module.exports = app => {
    const page = require("../controllers/page.js");
    app.get("/termsandcondition", page.termsandcondition);
    app.get("/privacypolicy", page.privacypolicy);
  };
  