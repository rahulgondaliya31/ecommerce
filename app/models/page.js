const sql = require("./db.js");

// constructor
const Page = function(page) {
  this.page_name = page.page_name;
  this.content = page.content;
};

Page.termsandcondition = (id, result) => {
  sql.query(`SELECT * FROM cms WHERE id = ${id}`, (err, res) => {
  result(null, res[0]);
  return;  
  });
};

Page.privacypolicy = (id, result) => {
  sql.query(`SELECT * FROM cms WHERE id = ${id}`, (err, res) => {
  result(null, res[0]);
  return;  
  });
};
module.exports = Page;