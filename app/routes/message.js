module.exports = app =>{
    var router = require("express").Router();
    const Message = require("../controllers/message.js");
    const fileUpload = require('express-fileupload');
    app.use(fileUpload());


  app.get("/getuser",Message.getuser);
  app.post("/selectreceiver",Message.selectreceiver);
  app.post("/sendmessage",Message.sendmessage)
  app.post("/get_post_message",Message.get_post_message)
  app.post("/getchatlist",Message.getchatlist)
  app.post("/updatemsg",Message.updatemsg)




}