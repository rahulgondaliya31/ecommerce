const Page = require("../models/page.js");

exports.termsandcondition = (req, res) => {
  var id = 6;
  Page.termsandcondition(id, (err, data) => {
    return res.send({
         success:"yes",
         message: "",
         data: data
    });
  });
};


exports.privacypolicy = (req, res) => {
  var id = 7;
  Page.privacypolicy(id, (err, data) => {
    return res.send({
         success:"yes",
         message: "",
         data: data
    });
  });
};