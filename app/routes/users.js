module.exports = app =>{
    var router = require("express").Router();
    const users = require("../controllers/users.js");
    const fileUpload = require('express-fileupload');
    app.use(fileUpload());

    app.post("/login",users.login);
    app.post('/register',users.register);
    app.post('/edituser',users.edituser);
    app.post('/get_user_detail',users.get_user_detail);
    app.post('/logout',users.logout);
    app.post("/getaddresslisting", users.getaddresslisting);
    app.post("/set_default_address", users.set_default_address);
    app.post("/add_or_edit_address", users.add_or_edit_address);
    app.post("/delete_address", users.delete_address);
    app.post("/forgetpassword",users.forgetpassword)
    

}