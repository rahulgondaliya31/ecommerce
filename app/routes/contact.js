module.exports = app =>{
    var router = require("express").Router();
    const Contact = require("../controllers/contact.js");
    const fileUpload = require('express-fileupload');
    app.use(fileUpload());

    app.get('/contact',Contact.contact);
    app.post('/newcontact',Contact.newcontact);
    app.post('/deletecontact',Contact.deletecontact);
    app.post('/updatecontact',Contact.updatecontact);
}